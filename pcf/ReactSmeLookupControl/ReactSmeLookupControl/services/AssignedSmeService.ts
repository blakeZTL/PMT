import { IInputs } from "../generated/ManifestTypes";
import { AssignedSme, IAssignedSmeApiResult } from "../types/AssignedSme";

export class AssignedSmeService {
  private _context: ComponentFramework.Context<IInputs>;
  private _options = `?$select=pmt_assignedsmeid,pmt_email,pmt_fullname&$expand=pmt_Facility($select=pmt_facilityid,pmt_pmtfacilityid),pmt_smerequest_AssignedSME_pmt_assignedsme($select=pmt_autoid,pmt_smerequestid;$expand=pmt_smehour_Request_pmt_smerequest($select=pmt_autoid,pmt_date,pmt_hours,pmt_smehourid);$filter=(pmt_smerequestid ne 0675013b-e3eb-ef11-be20-7c1e5248a34a))&$filter=(pmt_assignedsmeid eq 8c1586df-d6eb-ef11-be20-7c1e5248a34a)`;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
  }

  public async getAssignedSmes(): Promise<AssignedSme[]> {
    console.debug("AssignedSmeService.getAssignedSmes");
    const assignedSmes = await this._context.webAPI.retrieveMultipleRecords(
      "pmt_assignedsme",
      this._options
    );
    return assignedSmes.entities.map((entity) =>
      AssignedSme.fromJson(entity as IAssignedSmeApiResult)
    );
  }

  public async getAssignedSme(id: string): Promise<AssignedSme> {
    const assignedSme = await this._context.webAPI.retrieveRecord(
      "pmt_assignedsme",
      id,
      this._options
    );
    return AssignedSme.fromJson(assignedSme as IAssignedSmeApiResult);
  }
}
