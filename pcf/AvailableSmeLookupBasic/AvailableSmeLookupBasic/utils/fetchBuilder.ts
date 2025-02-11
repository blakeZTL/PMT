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
