import { IInputs } from "../generated/ManifestTypes";
import { IProgramApiResult, Program } from "../types/Program";

export class ProgramService {
  private _context: ComponentFramework.Context<IInputs>;
  private _options = `?$select=pmt_programid,pmt_name`;

  constructor(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
  }

  public async getPrograms(): Promise<Program[]> {
    const programs = await this._context.webAPI.retrieveMultipleRecords(
      "pmt_program",
      this._options
    );
    return programs.entities.map((entity) =>
      Program.fromJson(entity as IProgramApiResult)
    );
  }

  public async getProgram(id: string): Promise<Program> {
    const program = await this._context.webAPI.retrieveRecord(
      "pmt_program",
      id,
      this._options
    );
    return Program.fromJson(program as IProgramApiResult);
  }
}
