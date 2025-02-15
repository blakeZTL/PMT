import { SmeLookup } from "./components/SmeLookup";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";

import { AssignedSme, IAssignedSmeApiResult } from "./types/AssignedSme";

import { mockAssignedSmeData } from "./data/mockAssignedSme";
import { AssignedSmeService } from "./services/AssignedSmeService";

export class ReactSmeLookupControl
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;
  private _context: ComponentFramework.Context<IInputs>;

  private _environment: string | null = "DEV";
  private _assignedSmes: AssignedSme[] = [];

  private _selectedSme: ComponentFramework.LookupValue | null = null;

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
    this._selectedSme = context.parameters.smeLookup?.raw[0] ?? null;
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
    if (this._environment === "DEV") {
      this._assignedSmes = mockAssignedSmeData.value.map((item) => {
        return AssignedSme.fromJson(item as IAssignedSmeApiResult);
      });
      this._selectedSme = {
        id: this._assignedSmes[0].id,
        name: this._assignedSmes[0].email,
        entityType: "pmt_assignedsme",
      };
    } else {
      const assignedSmeService = new AssignedSmeService(this._context);
      assignedSmeService
        .getAssignedSmes()
        .then((data) => {
          this._assignedSmes = data;
          return;
        })
        .catch((error) => {
          console.error("Error fetching assigned smes: ", error);
        });
    }
    return React.createElement(SmeLookup, {
      assignedSmes: this._assignedSmes,
      selectedItem: this._selectedSme,
      onInputChange: this.onInputChange,
    });
  }

  onInputChange = (newValue: ComponentFramework.LookupValue | null) => {
    this._selectedSme = newValue;
    this.notifyOutputChanged();
    console.debug("Selected Sme: ", this._selectedSme);
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
