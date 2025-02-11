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
    this.startDate = startDate || new Date();
    this.endDate = endDate || new Date();
    this.requestedSme = requestedSme || new AssignedSme();
    this.assignedSme = assignedSme || new AssignedSme();
  }
}
