
# Program Management Tool - Handle Assigned SME Selection Plugin

## Overview

The `HandleAssignedSmeSelectionPlugin` is a plugin designed to ensure that the Assigned SME selected for an SME Request is valid for the related Resource Request. It is registered on the pre-validation stage of the Create and Update messages of the SME Request entity.

## Configuration

The plugin requires the following unsecure configuration (delimited by semi-colons):

- **Publisher Prefix**: The prefix used for custom entities and fields.
- **Assigned SME lookup logical name**: The logical name of the Assigned SME lookup field.

## Functionality

The plugin performs the following checks:

1. **Message Type Check**: Ensures the plugin is triggered only on "Create" and "Update" messages.
2. **Target Entity Check**: Validates that the target entity is not null.
3. **Assigned SME Reference Check**: Ensures the Assigned SME reference is present on the target entity.
4. **Resource Request Reference Check**: Validates the Resource Request reference on the target entity or pre-image.
5. **Available SMEs Fetch**: Retrieves the list of available SMEs for the Resource Request.
6. **Assigned SME Validation**: Checks if the selected Assigned SME is valid for the Resource Request.

## Error Handling

The plugin throws an `InvalidPluginExecutionException` in the following scenarios:

- Missing or invalid unsecure configuration.
- Null `localPluginContext`.
- Null target entity.
- Missing or null Resource Request reference on create.
- Missing Resource Request reference on update.
- No available SMEs registered for the Resource Request.
- Invalid Assigned SME selected for the Resource Request.

## Example

Here is an example of how to configure the plugin:

```xml
<PluginAssembly>
  <Name>ProgramManagementTool</Name>
  <SourceType>Database</SourceType>
  <IsolationMode>Sandbox</IsolationMode>
</PluginAssembly>
<PluginType>
  <Name>HandleAssignedSmeSelectionPlugin</Name>
  <FriendlyName>Handle Assigned SME Selection Plugin</FriendlyName>
  <Description>Ensures the Assigned SME selected for an SME Request is valid for the related Resource Request.</Description>
  <TypeName>ProgramManagementTool.HandleAssignedSmeSelectionPlugin</TypeName>
  <PluginAssemblyName>ProgramManagementTool</PluginAssemblyName>
</PluginType>
<Step>
  <Message>Create</Message>
  <PrimaryEntity>smerequest</PrimaryEntity>
  <Stage>PreValidation</Stage>
  <Configuration>publisherPrefix;assignedSmeLookupLogicalName</Configuration>
</Step>
<Step>
  <Message>Update</Message>
  <PrimaryEntity>smerequest</PrimaryEntity>
  <Stage>PreValidation</Stage>
  <Configuration>publisherPrefix;assignedSmeLookupLogicalName</Configuration>
</Step>
```

## Conclusion

The `HandleAssignedSmeSelectionPlugin` ensures data integrity by validating the Assigned SME selection against the related Resource Request, preventing invalid assignments and maintaining consistency within the system.
