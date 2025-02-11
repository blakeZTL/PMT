import { createAvailableSmeSelect } from "./components/CreateAvailableSmeSelect";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ResourceRequest } from "./types/ResourceRequest";
import { filterForAvailableSmeFetchBuilder } from "./utils/fetchBuilder";

export class AvailableSmeLookupBasic
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;
  private _selectedItem: ComponentFramework.LookupValue | undefined;
  private _availableSmes: ComponentFramework.LookupValue[];
  private _resourceRequest: ResourceRequest;

  private _entityType = "";
  private _resourceRequestId = "";
  private _publisherPrefix = "";
  private _shouldFilterSmes = false;

  /**
   * Empty constructor.
   */
  constructor() {
    // Empty
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public async init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): Promise<void> {
    console.debug("AvailableSmeLookupBasic version 1.0.5");
    this._container = container;
    this._context = context;
    this._notifyOutputChanged = notifyOutputChanged;
    this._entityType =
      this._context.parameters.assignedSmeLookup.getTargetEntityType?.();
    this._publisherPrefix = this._entityType.split("_")[0];
    this._resourceRequestId =
      this._context.parameters.resourceRequestLookup.raw[0].id;
    this._selectedItem = this._context.parameters.assignedSmeLookup.raw[0];
    this._shouldFilterSmes = this._context.parameters.shouldFilterSmes.raw;
    this._resourceRequest = new ResourceRequest(
      `${this._publisherPrefix}_resourcerequest`,
      this._resourceRequestId,
      this._context
    );
    await this._resourceRequest.init();
    console.debug("resourceRequest", this._resourceRequest);
    console.debug("entityType", this._entityType);
    console.debug("publisherPrefix", this._publisherPrefix);
    console.debug("resourceRequestId", this._resourceRequestId);
    console.debug("selectedItem", this._selectedItem);
    console.debug("shouldFilterSmes", this._shouldFilterSmes);

    // if (this._shouldFilterSmes) {
    //   this._availableSmes =
    //     this._resourceRequest.availableSmes.asLookupValues();
    // } else {
    //   await this.fetchAndSetData();
    // }
    await this.fetchAndSetData();
    createAvailableSmeSelect(
      this._selectedItem,
      this._availableSmes,
      this._container,
      this._shouldFilterSmes,
      this.onChange.bind(this)
    );
    this.toggleWarningVisibility();
  }

  onChange(newValue: ComponentFramework.LookupValue | undefined): void {
    console.debug("onChange", newValue);
    this._selectedItem = newValue;
    this.toggleWarningVisibility();
    this._notifyOutputChanged();
  }

  toggleWarningVisibility(): void {
    const warningContainer = this._container.querySelector(
      "#availableSmeWarningContainer"
    ) as HTMLDivElement;
    if (warningContainer) {
      const selectedSmeIsAvailable = this._resourceRequest.availableSmes.some(
        (sme) => sme.id === this._selectedItem?.id
      );
      if (this._selectedItem?.id && !selectedSmeIsAvailable) {
        console.debug(
          "Selected SME is not available for this Resource Request"
        );
        warningContainer.style.display = "block";
      } else {
        warningContainer.style.display = "none";
      }
    }
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;
    const selectElement = this._container.querySelector("select");
    if (selectElement) {
      selectElement.value = this._selectedItem?.id || "";
    }
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return {
      assignedSmeLookup: this._selectedItem ? [this._selectedItem] : undefined,
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }

  async fetchAndSetData(): Promise<void> {
    try {
      let response: ComponentFramework.WebApi.RetrieveMultipleResponse;
      if (this._shouldFilterSmes) {
        const fetchXml = filterForAvailableSmeFetchBuilder(
          this._publisherPrefix,
          this._resourceRequestId
        );
        console.debug("Filtering SMEs");
        response = await this._context.webAPI.retrieveMultipleRecords(
          this._entityType,
          `?fetchXml=${encodeURIComponent(fetchXml)}`
        );
      } else {
        console.debug("Fetching all SMEs", this._entityType);
        response = await this._context.webAPI.retrieveMultipleRecords(
          this._entityType
        );
      }
      console.debug("fetchAndSetData entities: ", response.entities);
      this._availableSmes = response.entities.map((entity) => {
        return {
          id: entity[`${this._publisherPrefix}_assignedsmeid`],
          name: entity[`${this._publisherPrefix}_name`],
          entityType: this._entityType,
        };
      });
      console.debug("this._availableSmes", this._availableSmes);
    } catch (error) {
      console.error(error);
      this._availableSmes = [];
    }
  }
}
