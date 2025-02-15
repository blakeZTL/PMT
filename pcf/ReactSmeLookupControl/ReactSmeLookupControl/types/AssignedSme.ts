export interface IAssignedSmeApiResult {
  pmt_assignedsmeid: string;
  pmt_fullname: string;
  pmt_email: string;
  "facility.pmt_facilityid"?: string;
  "facility.pmt_pmtfacilityid"?: string;
  pmt_Facility: {
    pmt_facilityid: string;
    pmt_pmtfacilityid: string;
  };
}

export interface IFacility {
  pmt_facilityid: string;
  pmt_pmtfacilityid: string;
}

export class AssignedSme {
  public id: string;
  public fullName: string;
  public email: string;
  public facility: { facilityId: string; id: string };

  constructor(
    id?: string,
    fullName?: string,
    email?: string,
    facility?: IFacility
  ) {
    this.id = id ?? "";
    this.fullName = fullName ?? "";
    this.email = email ?? "";
    this.facility = {
      facilityId: facility?.pmt_facilityid ?? "",
      id: facility?.pmt_pmtfacilityid ?? "",
    };
  }

  public static fromJson(json: IAssignedSmeApiResult): AssignedSme {
    let facilityId = "";
    if (json["facility.pmt_facilityid"]) {
      facilityId = json["facility.pmt_facilityid"];
    } else if (json.pmt_Facility) {
      facilityId = json.pmt_Facility.pmt_facilityid;
    }

    let pmtFacilityId = "";
    if (json["facility.pmt_pmtfacilityid"]) {
      pmtFacilityId = json["facility.pmt_pmtfacilityid"];
    } else if (json.pmt_Facility) {
      pmtFacilityId = json.pmt_Facility.pmt_pmtfacilityid;
    }

    return new AssignedSme(
      json.pmt_assignedsmeid,
      json.pmt_fullname,
      json.pmt_email,
      {
        pmt_facilityid: facilityId,
        pmt_pmtfacilityid: pmtFacilityId,
      }
    );
  }
}
