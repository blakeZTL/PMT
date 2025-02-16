import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { Container } from "./components/Container";
import { ControlProps } from "./types/ControlProps";

export class ReactSmeLookupControl
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;
  private _context: ComponentFramework.Context<IInputs>;

  private _environment: string | undefined = "DEV";
  private _resourceRequest: ComponentFramework.LookupValue | undefined;
  private _selectedSme: ComponentFramework.LookupValue | undefined;
  private _smeRequestId: string | undefined;
  private _restrictToResourceRequest = false;
  private _controlProps: ControlProps;

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
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this._context = context;
    this._environment =
      context.parameters.environment?.raw === "PROD" ? "PROD" : "DEV";
    this._selectedSme = context.parameters.smeLookup?.raw[0] ?? undefined;
    this._resourceRequest =
      context.parameters.resourceRequestLookup?.raw[0] ?? undefined;
    this._smeRequestId = context.parameters.smeRequestId?.raw ?? undefined;
    this._restrictToResourceRequest =
      context.parameters.restrictToResourceRequest?.raw;

    this._controlProps = new ControlProps(
      context,
      notifyOutputChanged,
      this._environment,
      this._selectedSme,
      this._resourceRequest,
      this._smeRequestId
    );
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    this._context = context;
    this._environment =
      context.parameters.environment?.raw === "PROD" ? "PROD" : "DEV";
    this._selectedSme = context.parameters.smeLookup?.raw[0] ?? undefined;
    this._resourceRequest =
      context.parameters.resourceRequestLookup?.raw[0] ?? undefined;
    this._smeRequestId = context.parameters.smeRequestId?.raw ?? undefined;
    this._restrictToResourceRequest =
      context.parameters.restrictToResourceRequest?.raw;

    this._controlProps.context = this._context;
    this._controlProps.selectedItem = this._selectedSme;
    this._controlProps.resourceRequest = this._resourceRequest;
    this._controlProps.smeRequestId = this._smeRequestId;
    this._controlProps.restrictToResourceRequest =
      this._restrictToResourceRequest;
    console.debug("UpdateView.ControlProps: ", this._controlProps);

    return React.createElement(Container, {
      controlProps: this._controlProps,
      onInputChange: this.onInputChange.bind(this),
    });
  }

  onInputChange = (newValue: ComponentFramework.LookupValue | undefined) => {
    if (!newValue?.id) {
      newValue = undefined;
    }
    this._selectedSme = newValue;
    this.notifyOutputChanged();
  };

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return {
      smeLookup: this._selectedSme ? [this._selectedSme] : [],
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
