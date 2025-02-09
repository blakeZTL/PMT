import { parseIdFromForm } from "../utils";

const publisherPrefix = "cra64";

export function filterRequestedSme(
  executionContext: Xrm.Events.EventContext,
): void {
  const formContext = executionContext.getFormContext();

  const requestedSmeControl = formContext.getControl(
    `${publisherPrefix}_requestedsme`,
  ) as Xrm.Controls.LookupControl;
  if (!requestedSmeControl) {
    console.error("Requested SME control not found");
  }

  const resourceRequestControl = formContext.getControl(
    `${publisherPrefix}_resourcerequest`,
  ) as Xrm.Controls.LookupControl;
  if (!resourceRequestControl) {
    console.error("Resource Request control not found");
    return;
  }
  const resourceRequestId = parseIdFromForm(
    resourceRequestControl.getAttribute().getValue()?.[0]?.id || "",
  );
  if (!resourceRequestId) {
    console.debug("Resource Request ID not found");
    return;
  }

  const resourceRequestFetchXml = `
    <fetch>
    <entity name="cra64_assignedsme">
      <attribute name="cra64_name" />
      <link-entity name="cra64_resourcerequest_cra64_assignedsme" from="cra64_assignedsmeid" to="cra64_assignedsmeid" intersect="true">
        <link-entity name="cra64_resourcerequest" from="cra64_resourcerequestid" to="cra64_resourcerequestid" intersect="true">
          <filter>
            <condition attribute="cra64_resourcerequestid" operator="eq" value="${resourceRequestId}" />
          </filter>
        </link-entity>
      </link-entity>
    </entity>
  </fetch>
  `;
  try {
    requestedSmeControl.addPreSearch(() => {
      requestedSmeControl.addCustomFilter(resourceRequestFetchXml);
    });
  } catch (error) {
    console.error(
      "Error adding custom filter to Requested SME control:",
      error,
    );
  }
}
