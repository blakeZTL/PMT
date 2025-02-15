import { IInputs } from "../generated/ManifestTypes";
import { ISmeRequestApiResult, SmeRequest } from "../types/SmeRequest";

export class SmeRequestService {
  private _context: ComponentFramework.Context<IInputs>;
  private _options = `?$select=pmt_autoid,pmt_smerequestid&$expand=pmt_AssignedSME($select=pmt_assignedsmeid,pmt_email,pmt_fullname;$expand=pmt_Facility($select=pmt_facilityid,pmt_pmtfacilityid)),pmt_Request($select=pmt_autoid,pmt_resourcerequestid;$expand=pmt_Program($select=pmt_name,pmt_programid)),pmt_RequestedSME($select=pmt_assignedsmeid,pmt_email,pmt_fullname;$expand=pmt_Facility($select=pmt_facilityid,pmt_pmtfacilityid))`;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
  }

  public async getSmeRequests(): Promise<SmeRequest[]> {
    const smeRequests = await this._context.webAPI.retrieveMultipleRecords(
      "pmt_smerequest",
      this._options
    );
    return smeRequests.entities.map((entity) =>
      SmeRequest.fromJson(entity as ISmeRequestApiResult)
    );
  }

  public async getSmeRequest(id: string): Promise<SmeRequest> {
    const smeRequest = await this._context.webAPI.retrieveRecord(
      "pmt_smerequest",
      id,
      this._options
    );
    return SmeRequest.fromJson(smeRequest as ISmeRequestApiResult);
  }
}
