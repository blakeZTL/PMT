using System;
using System.Linq;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace ProgramManagementTool
{
    /// <summary>
    /// Plugin to ensure that the Assigned SME selected for a SME Request is valid for the related Resource Request.
    /// It is registered on the pre-validation stage of the Create and Update messages of the SME Request entity.
    /// Requires the following unsecure configuration (delimited by semi-colons):
    /// <list type="bullet">
    /// <item>
    /// <description>Publisher Prefix</description>
    /// </item>
    /// <item>
    /// <description>Assigned SME lookup logical name</description>
    /// </item>
    /// </list>
    /// The plugin is intended to gatekeep two lookup fields:
    /// <list type="bullet">
    /// <item>
    /// <description>The Assigned SME lookup on the SME Request</description>
    /// </item>
    /// <item>
    /// <description>The Requested SME lookup on the SME Request</description>
    /// </item>
    /// </list>
    /// </summary>
    public class HandleAssignedSmeSelectionPlugin : PluginBase
    {
        private readonly string _publisherPrefix;
        private readonly string _assignedSmeRefLogicalName;
        private string _error;

        public HandleAssignedSmeSelectionPlugin(string unsecureConfig, string secureConfig)
            : base(typeof(HandleAssignedSmeSelectionPlugin))
        {
            string[] unsecureConfigs = unsecureConfig.Split(new char[] { ';' });
            _publisherPrefix =
                unsecureConfigs[0]
                ?? throw new InvalidPluginExecutionException(
                    "Unsecure configuration needs the publisher prefix"
                );
            _assignedSmeRefLogicalName =
                unsecureConfigs[1]
                ?? throw new InvalidPluginExecutionException(
                    "Unsecure configuration needs the relevant Assigned SME lookup logical name"
                );
        }

        protected override void ExecuteCdsPlugin(ILocalPluginContext localPluginContext)
        {
            if (localPluginContext == null)
            {
                throw new InvalidPluginExecutionException("localPluginContext was null");
            }

            IPluginExecutionContext context = localPluginContext.PluginExecutionContext;
            IOrganizationService systemService = localPluginContext.SystemUserService;
            ITracingService tracer = localPluginContext.TracingService;

            if (context.MessageName != "Create" && context.MessageName != "Update")
            {
                tracer.Trace("Message type not applicable");
                return;
            }

            context.InputParameters.TryGetValue("Target", out Entity targetEntity);
            if (targetEntity == null)
            {
                _error = "Target was null";
                tracer.Trace(_error);
                throw new InvalidPluginExecutionException(_error);
            }

            tracer.Trace(
                $"Publisher Prefix: {_publisherPrefix}, Assigned SME Reference: {_assignedSmeRefLogicalName}"
            );

            targetEntity.TryGetAttributeValue(
                $"{_publisherPrefix}_{_assignedSmeRefLogicalName}",
                out EntityReference assignedSmeRef
            );
            if (assignedSmeRef == null)
            {
                tracer.Trace("Assigned SME reference not found on target. Exiting");
                return;
            }

            targetEntity.TryGetAttributeValue(
                $"{_publisherPrefix}_resourcerequest",
                out EntityReference resourceRequestRef
            );
            if (resourceRequestRef == null && context.MessageName == "Update")
            {
                context.PreEntityImages.TryGetValue("PreImage", out Entity preImage);
                if (preImage == null)
                {
                    _error = "PreImage was null on update";
                    tracer.Trace(_error);
                    throw new InvalidPluginExecutionException(_error);
                }

                preImage.TryGetAttributeValue(
                    $"{_publisherPrefix}_resourcerequest",
                    out resourceRequestRef
                );

                if (resourceRequestRef == null)
                {
                    _error = "Resource Request lookup value not found in Target or was null";
                    tracer.Trace(_error);
                    throw new InvalidPluginExecutionException(_error);
                }
            }
            else if (resourceRequestRef == null && context.MessageName == "Create")
            {
                _error = "Resource Request cannot be null on create if a SME is selected";
                tracer.Trace(_error);
                throw new InvalidPluginExecutionException(_error);
            }

            EntityCollection availableSmes;
            QueryExpression availableSmesQuery = new QueryExpression(
                $"{_publisherPrefix}_assignedsme"
            )
            {
                ColumnSet = new ColumnSet($"{_publisherPrefix}_assignedsmeid"),
                LinkEntities =
                {
                    new LinkEntity()
                    {
                        LinkFromEntityName = $"{_publisherPrefix}_assignedsme",
                        LinkFromAttributeName = $"{_publisherPrefix}_assignedsmeid",
                        LinkToEntityName =
                            $"{_publisherPrefix}_resourcerequest_{_publisherPrefix}_assignedsme",
                        LinkToAttributeName = $"{_publisherPrefix}_assignedsmeid",
                        LinkCriteria =
                        {
                            Conditions =
                            {
                                new ConditionExpression(
                                    $"{_publisherPrefix}_resourcerequestid",
                                    ConditionOperator.Equal,
                                    resourceRequestRef.Id
                                ),
                            },
                        },
                    },
                },
            };

            try
            {
                tracer.Trace("Fetching available SMEs");
                availableSmes = systemService.RetrieveMultiple(availableSmesQuery);
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }

            if (availableSmes.Entities.Count == 0)
            {
                _error =
                    $"No available SMES registered for Resource Request ({resourceRequestRef.Id})";
                tracer.Trace(_error);
                throw new InvalidPluginExecutionException(_error);
            }

            Guid[] availableSmeIds = availableSmes.Entities.Select(e => e.Id).ToArray();

            if (availableSmeIds.Contains(assignedSmeRef.Id))
            {
                tracer.Trace(
                    $"Valid SME selected for {_publisherPrefix}_{_assignedSmeRefLogicalName}"
                );
                return;
            }

            _error =
                $"Invalid Assigned SME ({assignedSmeRef.Id}) selected for Resource Request ({resourceRequestRef.Id})";
            tracer.Trace(_error);
            throw new InvalidPluginExecutionException(_error);
        }
    }
}
