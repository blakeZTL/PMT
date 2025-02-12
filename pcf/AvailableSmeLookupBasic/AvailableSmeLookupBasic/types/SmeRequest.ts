import { IInputs } from "../generated/ManifestTypes";
import { fetchOverlappingSmeRequestsFetchBuilder } from "../utils/fetchBuilder";
import { AssignedSme } from "./AssignedSme";
import { ResourceRequest } from "./ResourceRequest";

export class SmeRequest {
  public id: string;
  public name: string;
  public resourceRequest: ResourceRequest;
  public startDate: string;
  public endDate: string;
  public requestedSme: AssignedSme;
  public assignedSme: AssignedSme;
  public publisherPrefix: string;

  // Constructor signatures
  constructor(
    publisherPrefix: string,
    id: string,
    name?: string,
    resourceRequest?: ResourceRequest,
    startDate?: string,
    endDate?: string,
    requestedSme?: AssignedSme,
    assignedSme?: AssignedSme
  ) {
    this.publisherPrefix = publisherPrefix;
    this.id = id;
    this.name = name || "";
    this.resourceRequest = resourceRequest || new ResourceRequest("", "");
    this.startDate = this.convertToUTC(
      startDate ? new Date(startDate) : undefined
    );
    this.endDate = this.convertToUTC(endDate ? new Date(endDate) : undefined);
    this.requestedSme = requestedSme || new AssignedSme();
    this.assignedSme = assignedSme || new AssignedSme();
  }

  private convertToUTC(date: Date | undefined): string {
    if (!date) {
      return "";
    }
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getUTCDate()).padStart(2, "0")}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _fromFetchBuilderJson(json: Record<string, any>): SmeRequest {
    this.id = json[`${this.publisherPrefix}_smerequestid`];
    this.name = json[`${this.publisherPrefix}_name`];
    this.startDate = json[`${this.publisherPrefix}_startdate`];
    this.endDate = json[`${this.publisherPrefix}_enddate`];
    this.resourceRequest = new ResourceRequest(
      `${this.publisherPrefix}_resourcerequest`,
      json[`resourceRequest.${this.publisherPrefix}_resourcerequestid`],
      json[`resourceRequest.${this.publisherPrefix}_name`] || "",
      {
        id: json[`program.${this.publisherPrefix}_programid`] || "",
        name: json[`program.${this.publisherPrefix}_name`] || "",
      }
    );
    this.requestedSme = new AssignedSme(
      `${this.publisherPrefix}_assignedsme`,
      json[`requestedSme.${this.publisherPrefix}_assignedsmeid`],
      json[`requestedSme.${this.publisherPrefix}_name`]
    );
    this.assignedSme = new AssignedSme(
      `${this.publisherPrefix}_assignedsme`,
      json[`assignedSme.${this.publisherPrefix}_assignedsmeid`],
      json[`assignedSme.${this.publisherPrefix}_name`]
    );
    return this;
  }

  public static async getOverlappingSmeRequests(
    smeRequest: SmeRequest,
    selectedSme: ComponentFramework.LookupValue | undefined,
    context: ComponentFramework.Context<IInputs>
  ): Promise<SmeRequest[]> {
    if (!selectedSme) {
      console.debug("getOverlappingSmeRequests: No selectedSme");
      return [];
    } else {
      console.debug("getOverlappingSmeRequests: selectedSme", selectedSme);
    }

    let smeRequests: SmeRequest[] = [];
    const smeRequestFetchXml = fetchOverlappingSmeRequestsFetchBuilder(
      smeRequest,
      selectedSme
    );
    let response: ComponentFramework.WebApi.RetrieveMultipleResponse;
    try {
      response = await context.webAPI.retrieveMultipleRecords(
        `${smeRequest.publisherPrefix}_smerequest`,
        `?fetchXml=${encodeURIComponent(smeRequestFetchXml)}`
      );
      console.debug("getOverlappingSmeRequests entities: ", response.entities);
      if (response.entities.length === 0) {
        return smeRequests;
      }
      smeRequests = response.entities.map((entity) => {
        const overlappingSmeRequest = smeRequest._fromFetchBuilderJson(entity);
        return overlappingSmeRequest;
      });
      console.debug("getOverlappingSmeRequests smeRequests: ", smeRequests);
      return smeRequests;
    } catch (error) {
      console.debug("Error in SmeRequest.getOverlappingSmeRequests");
      console.error(error);
      return smeRequests;
    }
  }
}

// Surrounds SD or = SD
// Sd <= Sd
// Ed >= Sd

//Surrounds ED or = ED
// SD <= ED
// ED >= ED

// Surrounds all or == all
// SD <= SD
// ED >= ED

// Inside all
// SD >= SD
// ED <= ED
