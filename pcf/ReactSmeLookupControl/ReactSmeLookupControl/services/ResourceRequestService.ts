import { IInputs } from "../generated/ManifestTypes";
import {
  IResourceRequestApiResult,
  ResourceRequest,
} from "../types/ResourceRequest";

export class ResourceRequestService {
  private _context: ComponentFramework.Context<IInputs>;
  private _options = `$select=pmt_resourcerequestid,pmt_autoid$expand=pmt_Program($select=pmt_programid,pmt_name)`;

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
