import { SmeRequest } from "../types/SmeRequest";

export const filterForAvailableSmeFetchBuilder = (
  publisherPrefix: string,
  resourceRequestId: string
): string => {
  const fetchXml = `
        <fetch>
            <entity name="${publisherPrefix}_assignedsme">
            <attribute name="${publisherPrefix}_name" />
            <link-entity 
                name="${publisherPrefix}_resourcerequest_${publisherPrefix}_assignedsme"
                from="${publisherPrefix}_assignedsmeid"
                to="${publisherPrefix}_assignedsmeid"
                intersect="true"
            >
                <filter>
                    <condition 
                        attribute="${publisherPrefix}_resourcerequestid" 
                        operator="eq"
                        value="${resourceRequestId}" 
                    />
                </filter>            
            </link-entity>
            </entity>
        </fetch>
        `;
  //console.debug("filterForAvailableSmeFetchBuilder", fetchXml);
  return fetchXml;
};

export const fetchResourceRequestFetchBuilder = (
  publisherPrefix: string,
  resourceRequestId: string
): string => {
  const fetchXml = `
        <fetch>
            <entity name="${publisherPrefix}_resourcerequest">
            <attribute name="${publisherPrefix}_name" />
            <filter>
                <condition 
                    attribute="${publisherPrefix}_resourcerequestid" 
                    operator="eq"
                    value="${resourceRequestId}" 
                />
            </filter>
            <link-entity 
                name="${publisherPrefix}_program"
                from="${publisherPrefix}_programid"
                to="${publisherPrefix}_program"
                alias="program"
            >
                <attribute name="${publisherPrefix}_name" />
                <attribute name="${publisherPrefix}_programid" />
            </link-entity>        
            </entity>
        </fetch>
        `;
  //console.debug("fetchResourceRequestFetchBuilder", fetchXml);
  return fetchXml;
};

export const fetchOverlappingSmeRequestsFetchBuilder = (
  smeRequest: SmeRequest,
  selectedSme: ComponentFramework.LookupValue
): string => {
  const fetchXml = `<fetch>
        <entity name="${smeRequest.publisherPrefix}_smerequest">
            <attribute name="${smeRequest.publisherPrefix}_smerequestid" />
            <attribute name="${smeRequest.publisherPrefix}_autoid" />
            <attribute name="${smeRequest.publisherPrefix}_startdate" />
            <attribute name="${smeRequest.publisherPrefix}_enddate" />
            <filter type="or">
                <filter>                
                    <condition 
                        attribute="${smeRequest.publisherPrefix}_startdate"
                        operator="ge"
                        value="${smeRequest.startDate}"
                    />
                    <condition
                        attribute="${smeRequest.publisherPrefix}_startdate"
                        operator="le"
                        value="${smeRequest.endDate}"
                    />
                </filter>                
                <filter>
                    <condition
                        attribute="${smeRequest.publisherPrefix}_enddate"
                        operator="ge"
                        value="${smeRequest.startDate}"
                    />
                    <condition
                        attribute="${smeRequest.publisherPrefix}_enddate"
                        operator="le"
                        value="${smeRequest.endDate}"
                    />
                </filter>                
                <filter>
                    <condition
                        attribute="${smeRequest.publisherPrefix}_startdate"
                        operator="le"
                        value="${smeRequest.startDate}"
                    />
                    <condition
                        attribute="${smeRequest.publisherPrefix}_enddate"
                        operator="ge"
                        value="${smeRequest.endDate}"
                    />
                </filter>                
                <filter>
                    <condition
                    attribute="${smeRequest.publisherPrefix}_startdate"
                    operator="ge"
                    value="${smeRequest.startDate}"
                />
                    <condition
                        attribute="${smeRequest.publisherPrefix}_enddate"
                        operator="le"
                        value="${smeRequest.endDate}"
                    />
                </filter>                    
            </filter>
            <filter>
                <condition
                    attribute="${smeRequest.publisherPrefix}_smerequestid"
                    operator="ne"
                    value="${smeRequest.id}"
                />
            </filter>
            <link-entity
                name="${smeRequest.publisherPrefix}_sme"
                from="${smeRequest.publisherPrefix}_smeid"
                to="${smeRequest.publisherPrefix}_requestedsme"
                alias="sme"
            >
                    <attribute name="${smeRequest.publisherPrefix}_smeid" />
                    <attribute name="${smeRequest.publisherPrefix}_email" />
                    <attribute name="${smeRequest.publisherPrefix}_name" />
                <filter>
                    <condition
                        attribute="${smeRequest.publisherPrefix}_email"
                        operator="eq"
                        value="${selectedSme.id}"
                    />
                </filter>
            </link-entity>
        </entity>
    </fetch>`;
  return fetchXml;
};
