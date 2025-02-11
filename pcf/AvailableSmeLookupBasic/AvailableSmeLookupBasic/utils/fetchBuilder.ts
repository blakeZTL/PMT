export const filterForAvailableSmefetchBuilder = (
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
  return fetchXml;
};
