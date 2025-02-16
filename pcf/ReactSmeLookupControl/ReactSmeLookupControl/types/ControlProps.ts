import { IInputs } from "../generated/ManifestTypes";

export class ControlProps {
  context: ComponentFramework.Context<IInputs>;
  notifyOutputChanged: () => void;
  environment?: string;
  selectedItem?: ComponentFramework.LookupValue;
  resourceRequest?: ComponentFramework.LookupValue;
  smeRequestId?: string;
  restrictToResourceRequest?: boolean;

  constructor(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    environment?: string,
    selectedItem?: ComponentFramework.LookupValue,
    resourceRequest?: ComponentFramework.LookupValue,
    smeRequestId?: string,
    restrictToResourceRequest?: boolean
  ) {
    this.context = context;
    this.notifyOutputChanged = notifyOutputChanged;
    this.environment = environment;
    this.selectedItem = selectedItem;
    this.resourceRequest = resourceRequest;
    this.smeRequestId = smeRequestId;
    this.restrictToResourceRequest = restrictToResourceRequest;
  }
}
