import { ISmeRequestApiResult, SmeRequest } from "./SmeRequest";

export interface ISmeHourApiResult {
  pmt_sme_hourid: string;
  pmt_autoid: string;
  pmt_hours: number;
  pmt_date: string;
  pmt_Request: ISmeRequestApiResult | null;
}

export class SmeHour {
  public id: string;
  public autoId: string;
  public hours: number;
  public date: string | null = null;
  public request: SmeRequest | null;

  constructor(
    id?: string,
    autoId?: string,
    hours?: number,
    date?: string | null,
    request?: SmeRequest | null
  ) {
    this.id = id ?? "";
    this.autoId = autoId ?? "";
    this.hours = hours ?? 0;
    this.date = date ?? null;
    this.request = request ?? null;
  }

  public static fromJson(json: ISmeHourApiResult): SmeHour {
    return new SmeHour(
      json.pmt_sme_hourid,
      json.pmt_autoid,
      json.pmt_hours,
      json.pmt_date,
      json.pmt_Request ? SmeRequest.fromJson(json.pmt_Request) : null
    );
  }
}
