import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class AvailableSmeLookupBasic implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _entityType = "";
    private _selectedItem: ComponentFramework.LookupValue | undefined;
    private _availableSmes: ComponentFramework.LookupValue[];

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
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): Promise<void> {
        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._entityType = this._context.parameters.assignedSmeLookup.getTargetEntityType?.();
        this._selectedItem = this._context.parameters.assignedSmeLookup.raw[0];
        await this.fetchData();
        this.createSelectElement();
    }
    

    private createSelectElement(): void {
        const parentContainer = document.createElement("div");
        parentContainer.role = "presentation";
        parentContainer.className = "pa-b pa-iu flexbox";

        const elementContainer = document.createElement("div");
        elementContainer.role = "presentation";
        elementContainer.id = "availableSmeSelectElementsContainer";        

        const selectContainer = document.createElement("div");        
        selectContainer.id = "availableSmeSelectContainer";        

        const selectElement = document.createElement("select");
        selectElement.id = "availableSmeSelectControl";        
        selectElement.title = "Available SME Select Control";

        selectElement.addEventListener("change", (event) => {
            const selectedId = (event.target as HTMLSelectElement).value;
            this._selectedItem = this._availableSmes.find((element) => element.id === selectedId);
            this._notifyOutputChanged();
        });

        const selectIconSpan = document.createElement("span");
        selectIconSpan.id = "availableSmeSelectIconSpan";
        selectIconSpan.className = "symbolFont SearchButton-symbol";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "---";
        selectElement.appendChild(defaultOption);
        this._availableSmes?.forEach(element => {
            const option = document.createElement("option");
            option.value = element.id;
            option.text = element.name || "";
            selectElement.appendChild(option);
        });

        selectElement.value = this._selectedItem?.id || "";

        selectContainer.appendChild(selectElement);
        elementContainer.appendChild(selectContainer);       

        parentContainer.appendChild(elementContainer);
        
        this._container.appendChild(parentContainer);
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

    async fetchData(): Promise<void> {
        try {
            const response = await this._context.webAPI.retrieveMultipleRecords(this._entityType);
            console.debug("fetchData entities: ", response.entities);
            this._availableSmes = response.entities.map((entity) => {
                return {
                    id: entity["cra64_assignedsmeid"],
                    name: entity["cra64_name"],
                    entityType: this._entityType,
                };
            });
            console.debug("this._availableSmes", this._availableSmes);
        } catch (error) {
            console.error(error);
        }
    }
}

   