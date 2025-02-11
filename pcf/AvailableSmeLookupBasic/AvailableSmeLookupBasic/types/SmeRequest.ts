import { AssignedSme } from "./AssignedSme";

export class SmeRequest {
  public id: string;
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public requestedSme: AssignedSme;
  public assignedSme: AssignedSme;
  public publisherPrefix: string;

  // Constructor signatures
  constructor(
    publisherPrefix: string,
    id: string,
    name?: string,
    startDate?: Date,
    endDate?: Date,
    requestedSme?: AssignedSme,
    assignedSme?: AssignedSme
  ) {
    this.publisherPrefix = publisherPrefix;
    this.id = id;
    this.name = name || "";
    this.startDate = this.convertToUTC(startDate);
    this.endDate = this.convertToUTC(endDate);
    this.requestedSme = requestedSme || new AssignedSme();
    this.assignedSme = assignedSme || new AssignedSme();
  }

  private convertToUTC(date: Date | undefined): Date {
    if (!date) {
      return new Date();
    }
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      )
    );
  }
}
