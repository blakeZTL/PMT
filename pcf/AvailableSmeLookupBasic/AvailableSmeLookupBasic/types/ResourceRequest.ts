import { IInputs } from "../generated/ManifestTypes";
import {
  fetchResourceRequestFetchBuilder,
  filterForAvailableSmeFetchBuilder,
} from "../utils/fetchBuilder";
import { AssignedSme } from "./AssignedSme";

interface Program {
  id: string;
  name: string;
}

export class ResourceRequest {
  public entityType: string;
  public id: string;
  public name: string;
  public program: Program;
  public availableSmes: AvailableSmeLookupValues;
  private _context: ComponentFramework.Context<IInputs>;
  private _publisherPrefix: string;

  constructor(
    entityName: string,
    id: string,
    name?: string,
    program?: Program
  ) {
    this.entityType = entityName;
    this.id = id;
    this.name = name || "";
    this.program = {
      id: program?.id || "",
      name: program?.name || "",
    };
    this.availableSmes = new AvailableSmeLookupValues();
    this._publisherPrefix = this.entityType.split("_")[0];
  }

  public async init(
    context: ComponentFramework.Context<IInputs>
  ): Promise<void> {
    this._context = context;
    console.debug("ResourceRequest.init");
    await this._fetchAndSetResourceRequest();
    await this._fetchAndSetAvailableSmes();
  }

  private async _fetchAndSetResourceRequest() {
    console.debug("ResourceRequest_fetchAndSetResourceRequest");
    let response: ComponentFramework.WebApi.RetrieveMultipleResponse;
    try {
      const fetchXml = fetchResourceRequestFetchBuilder(
        this._publisherPrefix,
        this.id
      );
      response = await this._context.webAPI.retrieveMultipleRecords(
        this.entityType,
        `?fetchXml=${encodeURIComponent(fetchXml)}`
      );
      if (response.entities.length != 1) {
        console.error("Resource Request not found");
        return;
      }
      const entity = response.entities[0];
      this.name = entity[`${this._publisherPrefix}_name`];
      // Aliased values from link-entity
      this.program = {
        id: entity[`program.${this._publisherPrefix}_programid`],
        name: entity[`program.${this._publisherPrefix}_name`],
      };
    } catch (error) {
      console.debug("Error in ResourceRequest_fetchAndSetResourceRequest");
      console.error(error);
      return;
    }
  }

  private async _fetchAndSetAvailableSmes() {
    console.debug("ResourceRequest._fetchAndSetAvailableSmes");
    let response: ComponentFramework.WebApi.RetrieveMultipleResponse;
    try {
      const fetchXml = filterForAvailableSmeFetchBuilder(
        this._publisherPrefix,
        this.id
      );
      response = await this._context.webAPI.retrieveMultipleRecords(
        `${this._publisherPrefix}_assignedsme`,
        `?fetchXml=${encodeURIComponent(fetchXml)}`
      );
      this.availableSmes = new AvailableSmeLookupValues(
        ...response.entities.map((entity) => {
          const sme = new AssignedSme();
          sme.id = entity[`${this._publisherPrefix}_assignedsmeid`];
          sme.name = entity[`${this._publisherPrefix}_name`];
          sme.entityType = this.entityType;
          return sme;
        })
      );
    } catch (error) {
      console.debug("Error in ResourceRequest_fetchAndSetAvailableSmes");
      console.error(error);
    }
  }
}

export class AvailableSmeLookupValues extends Array<AssignedSme> {
  constructor(...items: AssignedSme[]) {
    super(...items);
    Object.setPrototypeOf(
      this,
      Object.create(AvailableSmeLookupValues.prototype)
    );
  }

  public asLookupValues(): ComponentFramework.LookupValue[] {
    return this.map((sme) => {
      return {
        id: sme.id,
        name: sme.name,
        entityType: sme.entityType,
      };
    });
  }
}
