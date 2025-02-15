import { IInputs } from "../generated/ManifestTypes";
import { ISmeHourApiResult, SmeHour } from "../types/SmeHour";

export class SmeHourService {
  private _context: ComponentFramework.Context<IInputs>;
  private _options = `?$select=pmt_autoid,pmt_date,pmt_hours,pmt_smehourid&$expand=pmt_Request($select=pmt_autoid,pmt_smerequestid;$expand=pmt_Request($select=pmt_autoid,pmt_resourcerequestid;$expand=pmt_Program($select=pmt_name,pmt_programid)),pmt_AssignedSME($select=pmt_assignedsmeid,pmt_email,pmt_fullname;$expand=pmt_Facility($select=pmt_facilityid,pmt_pmtfacilityid)),pmt_RequestedSME($select=pmt_assignedsmeid,pmt_email,pmt_fullname;$expand=pmt_Facility($select=pmt_facilityid,pmt_pmtfacilityid)))`;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
  }

  public async getSmeHours(): Promise<SmeHour[]> {
    const smeHours = await this._context.webAPI.retrieveMultipleRecords(
      "pmt_smehour",
      this._options
    );
    return smeHours.entities.map((entity) =>
      SmeHour.fromJson(entity as ISmeHourApiResult)
    );
  }

  public async getSmeHour(id: string): Promise<SmeHour> {
    const smeHour = await this._context.webAPI.retrieveRecord(
      "pmt_smehour",
      id,
      this._options
    );
    return SmeHour.fromJson(smeHour as ISmeHourApiResult);
  }
}
