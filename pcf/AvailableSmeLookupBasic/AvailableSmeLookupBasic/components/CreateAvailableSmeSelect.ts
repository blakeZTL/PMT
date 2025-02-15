export function createAvailableSmeSelect(
  selectedItem: ComponentFramework.LookupValue | undefined,
  availableSmes: ComponentFramework.LookupValue[],
  container: HTMLDivElement,
  filteringSmes: boolean,
  onChange: (newValue: ComponentFramework.LookupValue | undefined) => void
): void {
  if (!container) {
    console.error("Container element is null or undefined.");
    return;
  }
  console.debug("createAvailableSmeSelect", selectedItem, availableSmes);
  const parentContainer = document.createElement("div");
  parentContainer.id = "availableSmeLookupBasic_pcfContainer";

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
    selectedItem = availableSmes.find((element) => element.id === selectedId);
    onChange(selectedItem);
  });

  const selectIconSpan = document.createElement("span");
  selectIconSpan.id = "availableSmeSelectIconSpan";
  selectIconSpan.className = "symbolFont SearchButton-symbol";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "---";
  selectElement.appendChild(defaultOption);
  if (availableSmes.length > 0) {
    availableSmes?.forEach((element) => {
      const option = document.createElement("option");
      option.value = element.id;
      option.text = element.name || "";
      selectElement.appendChild(option);
    });
  }

  selectElement.value = selectedItem?.id || "";

  selectContainer.appendChild(selectElement);
  elementContainer.appendChild(selectContainer);
  parentContainer.appendChild(elementContainer);

  const warningContainer = document.createElement("div");
  warningContainer.id = "availableSmeWarningContainer";

  const warningMessage = document.createElement("p");
  warningMessage.id = "availableSmeWarningMessage";
  warningMessage.textContent =
    "*Selected SME not available for this Resource Request";

  if (!filteringSmes) {
    warningContainer.appendChild(warningMessage);
    parentContainer.appendChild(warningContainer);
  }

  container.appendChild(parentContainer);
}
