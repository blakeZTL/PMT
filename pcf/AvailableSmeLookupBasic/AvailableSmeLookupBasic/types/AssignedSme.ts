interface Facility {
  id: string;
  name: string;
}

export class AssignedSme {
  public entityType: string;
  public id: string;
  public name: string;
  public facility: Facility;

  constructor(
    entityType?: string,
    id?: string,
    name?: string,
    facility?: Facility
  ) {
    this.entityType = entityType || "";
    this.id = id || "";
    this.name = name || "";
    this.facility = {
      id: facility?.id || "",
      name: facility?.name || "",
    };
  }
}
