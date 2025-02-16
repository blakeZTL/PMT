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
  pmt_smerequest_AssignedSME_pmt_assignedsme: ISimplifiedSmeRequestWithHours[];
}

export interface IFacility {
  pmt_facilityid: string;
  pmt_pmtfacilityid: string;
}

export interface ISmeHour {
  pmt_date: string;
  pmt_autoid: string;
  pmt_smehourid: string;
  pmt_hours: number;
}

export interface ISimplifiedSmeRequestWithHours {
  pmt_autoid: string;
  pmt_smerequestid: string;
  pmt_smehour_Request_pmt_smerequest: ISmeHour[];
}

export class AssignedSme {
  public id: string;
  public fullName: string;
  public email: string;
  public facility: { facilityId: string; id: string };
  public smeRequests: ISimplifiedSmeRequestWithHours[];

  constructor(
    id?: string,
    fullName?: string,
    email?: string,
    facility?: IFacility,
    smeRequests?: ISimplifiedSmeRequestWithHours[]
  ) {
    this.id = id ?? "";
    this.fullName = fullName ?? "";
    this.email = email ?? "";
    this.facility = {
      facilityId: facility?.pmt_facilityid ?? "",
      id: facility?.pmt_pmtfacilityid ?? "",
    };
    this.smeRequests = smeRequests ?? [];
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

    const smeRequests: ISimplifiedSmeRequestWithHours[] = [];
    if (json.pmt_smerequest_AssignedSME_pmt_assignedsme) {
      const assignedSmeRequests =
        json.pmt_smerequest_AssignedSME_pmt_assignedsme;

      assignedSmeRequests.forEach((item) => {
        if (item.pmt_smehour_Request_pmt_smerequest?.length === 0) {
          return;
        }
        const smeHours: ISmeHour[] = [];
        item.pmt_smehour_Request_pmt_smerequest.forEach((smeHour) => {
          smeHours.push({
            pmt_date: smeHour.pmt_date,
            pmt_autoid: smeHour.pmt_autoid,
            pmt_smehourid: smeHour.pmt_smehourid,
            pmt_hours: smeHour.pmt_hours,
          });
        });
        smeRequests.push({
          pmt_autoid: item.pmt_autoid,
          pmt_smerequestid: item.pmt_smerequestid,
          pmt_smehour_Request_pmt_smerequest: smeHours,
        });
      });
    }

    return new AssignedSme(
      json.pmt_assignedsmeid,
      json.pmt_fullname,
      json.pmt_email,
      {
        pmt_facilityid: facilityId,
        pmt_pmtfacilityid: pmtFacilityId,
      },
      smeRequests
    );
  }
}
