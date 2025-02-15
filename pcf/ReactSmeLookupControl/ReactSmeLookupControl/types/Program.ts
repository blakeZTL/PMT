export interface IProgramApiResult {
  pmt_programid: string;
  pmt_name: string;
}

export class Program {
  public id: string;
  public name: string;

  constructor(id?: string, name?: string) {
    this.id = id ?? "";
    this.name = name ?? "";
  }

  public static fromJson(json: IProgramApiResult): Program {
    return new Program(json.pmt_programid, json.pmt_name);
  }
}
