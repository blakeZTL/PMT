import { IProgramApiResult, Program } from "./Program";

export interface IResourceRequestApiResult {
  pmt_resourcerequestid: string;
  pmt_autoid: string;
  pmt_Program: IProgramApiResult | null;
}

export class ResourceRequest {
  public id: string;
  public autoId: string;
  public program: Program | null;

  constructor(id?: string, autoId?: string, program?: Program | null) {
    this.id = id ?? "";
    this.autoId = autoId ?? "";
    this.program = program ?? null;
  }

  public static fromJson(json: IResourceRequestApiResult): ResourceRequest {
    return new ResourceRequest(
      json.pmt_resourcerequestid,
      json.pmt_autoid,
      json.pmt_Program ? Program.fromJson(json.pmt_Program) : null
    );
  }
}
