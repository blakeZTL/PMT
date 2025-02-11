export function createAvailableSmeSelect(
  selectedItem: ComponentFramework.LookupValue | undefined,
  availableSmes: ComponentFramework.LookupValue[],
  container: HTMLDivElement,
  onChange: (newValue: ComponentFramework.LookupValue | undefined) => void
): void {
  if (!container) {
    console.error("Container element is null or undefined.");
    return;
  }

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

  container.appendChild(parentContainer);
}
