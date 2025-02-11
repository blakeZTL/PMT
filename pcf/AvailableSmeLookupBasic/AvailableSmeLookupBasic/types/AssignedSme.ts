interface Facility {
  id: string;
  name: string;
}

export class AssignedSme {
  public entityType: string;
  public id: string;
  public name: string;
  public facility: Facility;

  constructor() {
    this.entityType = "";
    this.id = "";
    this.name = "";
    this.facility = {
      id: "",
      name: "",
    };
  }
}
