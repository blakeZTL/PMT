export class AssignedSme {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    static fromJson(publisherPrefix: string, json: any): AssignedSme {
        const id = json[`${publisherPrefix}_assignedsmeid`];
        const name = json[`${publisherPrefix}_name`];
        return new AssignedSme(id, name);
    }
}
