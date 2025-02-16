import { IInputs } from "../generated/ManifestTypes";
import {
  IResourceRequestApiResult,
  ResourceRequest,
} from "../types/ResourceRequest";

export class ResourceRequestService {
  private _context: ComponentFramework.Context<IInputs>;
  private _options = `?$select=pmt_autoid,pmt_resourcerequestid&$expand=pmt_Program($select=pmt_name,pmt_programid),pmt_ResourceRequest_pmt_AssignedSME_pmt_AssignedSME($select=pmt_assignedsmeid)`;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
  }

  public async getResourceRequests(): Promise<ResourceRequest[]> {
    const resourceRequests = await this._context.webAPI.retrieveMultipleRecords(
      "pmt_resourcerequest",
      this._options
    );
    return resourceRequests.entities.map((entity) =>
      ResourceRequest.fromJson(entity as IResourceRequestApiResult)
    );
  }

  public async getResourceRequest(id: string): Promise<ResourceRequest> {
    const resourceRequest = await this._context.webAPI.retrieveRecord(
      "pmt_resourcerequest",
      id,
      this._options
    );
    return ResourceRequest.fromJson(
      resourceRequest as IResourceRequestApiResult
    );
  }
}
