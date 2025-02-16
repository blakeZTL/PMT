import { AssignedSme } from "./AssignedSme";
import { IProgramApiResult, Program } from "./Program";

export interface IResourceRequestApiResult {
  pmt_resourcerequestid: string;
  pmt_autoid: string;
  pmt_Program: IProgramApiResult | null;
  pmt_ResourceRequest_pmt_AssignedSME_pmt_AssignedSME:
    | {
        pmt_assignedsmeid: string;
      }[]
    | undefined;
}

export class ResourceRequest {
  public id: string;
  public autoId: string;
  public program: Program | null;
  public assignedSmes: AssignedSme[];

  constructor(
    id?: string,
    autoId?: string,
    program?: Program | null,
    assignedSmes?: AssignedSme[]
  ) {
    this.id = id ?? "";
    this.autoId = autoId ?? "";
    this.program = program ?? null;
    this.assignedSmes = assignedSmes ?? [];
  }

  public static fromJson(json: IResourceRequestApiResult): ResourceRequest {
    return new ResourceRequest(
      json.pmt_resourcerequestid,
      json.pmt_autoid,
      json.pmt_Program ? Program.fromJson(json.pmt_Program) : null,
      json.pmt_ResourceRequest_pmt_AssignedSME_pmt_AssignedSME?.map((item) => {
        return new AssignedSme(item.pmt_assignedsmeid);
      })
    );
  }
}
