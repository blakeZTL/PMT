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
  public availableSmes: AssignedSme[];
  private _context: ComponentFramework.Context<IInputs>;
  private _publisherPrefix: string;

  constructor(
    entityName: string,
    id: string,
    context: ComponentFramework.Context<IInputs>
  ) {
    this.entityType = entityName;
    this.id = id;
    this.name = "";
    this.program = {
      id: "",
      name: "",
    };
    this.availableSmes = [];
    this._context = context;
    this._publisherPrefix = this.entityType.split("_")[0];
    this._fetchAndSetResourceRequest();
    this._fetchAndSetAvailableSmes();
  }

  private async _fetchAndSetResourceRequest() {
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
      console.debug("fetchResourceRequest entities: ", response.entities);
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
      console.error(error);
      return;
    }
  }

  private async _fetchAndSetAvailableSmes() {
    let response: ComponentFramework.WebApi.RetrieveMultipleResponse;
    try {
      const fetchXml = filterForAvailableSmeFetchBuilder(
        this._publisherPrefix,
        this.id
      );
      response = await this._context.webAPI.retrieveMultipleRecords(
        this.entityType,
        `?fetchXml=${encodeURIComponent(fetchXml)}`
      );
      console.debug("_fetchAndSetAvailableSmes entities: ", response.entities);
      this.availableSmes = response.entities.map((entity) => {
        const sme = new AssignedSme();
        sme.id = entity[`${this._publisherPrefix}_assignedsmeid`];
        sme.name = entity[`${this._publisherPrefix}_name`];
        sme.entityType = this.entityType;
        return sme;
      });
      console.debug("this.availableSmes", this.availableSmes);
    } catch (error) {
      console.error(error);
    }
  }
}
