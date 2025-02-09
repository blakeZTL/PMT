import { parseIdFromForm } from '../utils';

export async function filterRequestedSme(
    executionContext: Xrm.Events.EventContext,
    publisherPrefix: string
): Promise<void> {
    const version = '1.2.0';
    console.debug(`filterRequestedSme version ${version}`);
    if (!executionContext) {
        console.error('Execution context is not defined');
        return;
    }
    if (!publisherPrefix) {
        console.error('Publisher prefix is not defined');
        return;
    }

    const formContext = executionContext.getFormContext();

    const requestedSmeControl = formContext.getControl(
        `${publisherPrefix}_requestedsme`
    ) as Xrm.Controls.LookupControl;
    if (!requestedSmeControl) {
        console.error('Requested SME control not found');
    }

    const resourceRequestControl = formContext.getControl(
        `${publisherPrefix}_resourcerequest`
    ) as Xrm.Controls.LookupControl;
    if (!resourceRequestControl) {
        console.error('Resource Request control not found');
        return;
    }
    const resourceRequestId = parseIdFromForm(
        resourceRequestControl.getAttribute().getValue()?.[0]?.id || ''
    );
    if (!resourceRequestId) {
        console.debug('Resource Request ID not found');
        return;
    }
    const assignedSmeFetchXml = `
      <fetch>
        <entity name="${publisherPrefix}_assignedsme">
          <attribute name="${publisherPrefix}_name" />
          <link-entity name="${publisherPrefix}_resourcerequest_${publisherPrefix}_assignedsme" from="${publisherPrefix}_assignedsmeid" to="${publisherPrefix}_assignedsmeid" intersect="true">
            <filter>
              <condition attribute="${publisherPrefix}_resourcerequestid" operator="eq" value="${resourceRequestId}" />
            </filter>            
          </link-entity>
        </entity>
      </fetch>
    `;

    const requestedSmeLayoutXml = `
      <grid name="resultset" object="${publisherPrefix}_requestedsme" jump="${publisherPrefix}_name" select="1" icon="1" preview="1">
          <row name="result" id="pmt_routingactionid">
              <cell name="${publisherPrefix}_name" width="300" />
          </row>
      </grid>
    `;
    const customView = {
        viewId: '00000000-0000-0000-0000-000000000001',
        entityName: `${publisherPrefix}_assignedsme`,
        viewDisplayName: 'Available SMEs',
        fetchXml: assignedSmeFetchXml,
        layoutXml: requestedSmeLayoutXml,
        isDefault: true
    };

    try {
        requestedSmeControl.addCustomView(
            customView.viewId,
            customView.entityName,
            customView.viewDisplayName,
            customView.fetchXml,
            customView.layoutXml,
            customView.isDefault
        );
    } catch (error) {
        console.error('Error adding custom filter to Requested SME control:', error);
    }

    const assignedSmeControl = formContext.getControl(
        `${publisherPrefix}_assignedsme`
    ) as Xrm.Controls.LookupControl;
    if (!assignedSmeControl) {
        console.error('Assigned SME control not found');
        return;
    }
    try {
        assignedSmeControl.addCustomView(
            customView.viewId,
            customView.entityName,
            customView.viewDisplayName,
            customView.fetchXml,
            customView.layoutXml,
            customView.isDefault
        );
    } catch (error) {
        console.error('Error adding custom filter to Assigned SME control:', error);
    }
}
