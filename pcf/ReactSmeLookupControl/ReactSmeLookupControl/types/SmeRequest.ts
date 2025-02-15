import { AssignedSme, IAssignedSmeApiResult } from "./AssignedSme";

export interface ISmeRequestApiResult {
  pmt_smerequestid: string;
  pmt_autoid: string;
  pmt_AssignedSME: IAssignedSmeApiResult | null;
  pmt_Request: {
    pmt_autoid: string;
    pmt_resourcerequestid: string;
    pmt_Program: {
      pmt_name: string;
      pmt_programid: string;
    };
  } | null;
  pmt_RequestedSME: IAssignedSmeApiResult | null;
}

export class SmeRequest {
  public id: string;
  public autoId: string;
  public assignedSme: AssignedSme | null;
  public request: {
    autoId: string;
    resourceId: string;
    program: {
      name: string;
      programId: string;
    };
  } | null;
  public requestedSme: AssignedSme | null;

  constructor(
    id?: string,
    autoId?: string,
    assignedSme?: AssignedSme | null,
    request?: {
      autoId: string;
      resourceId: string;
      program: {
        name: string;
        programId: string;
      };
    },
    requestedSme?: AssignedSme | null
  ) {
    this.id = id ?? "";
    this.autoId = autoId ?? "";
    this.assignedSme = assignedSme ?? null;
    this.request = request ?? null;
    this.requestedSme = requestedSme ?? null;
  }

  public static fromJson(json: ISmeRequestApiResult): SmeRequest {
    return new SmeRequest(
      json.pmt_smerequestid,
      json.pmt_autoid,
      json.pmt_AssignedSME ? AssignedSme.fromJson(json.pmt_AssignedSME) : null,
      {
        autoId: json.pmt_Request?.pmt_autoid ?? "",
        resourceId: json.pmt_Request?.pmt_resourcerequestid ?? "",
        program: {
          name: json.pmt_Request?.pmt_Program?.pmt_name ?? "",
          programId: json.pmt_Request?.pmt_Program?.pmt_programid ?? "",
        },
      },
      json.pmt_RequestedSME ? AssignedSme.fromJson(json.pmt_RequestedSME) : null
    );
  }
}
