import { IInputs } from "../generated/ManifestTypes";
import { AssignedSme, IAssignedSmeApiResult } from "../types/AssignedSme";

export class AssignedSmeService {
  private _context: ComponentFramework.Context<IInputs>;
  private _options = `?$select=pmt_assignedsmeid,pmt_email,pmt_fullname&$expand=pmt_Facility($select=pmt_pmtfacilityid,pmt_facilityid)`;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
  }

  public async getAssignedSmes(): Promise<AssignedSme[]> {
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
