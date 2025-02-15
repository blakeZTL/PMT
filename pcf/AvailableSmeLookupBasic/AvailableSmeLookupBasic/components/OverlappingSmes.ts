import { SmeRequest } from "../types/SmeRequest";
import {
  provideFluentDesignSystem,
  fluentDataGridCell,
  fluentDataGridRow,
  fluentDataGrid,
  DataGrid,
} from "@fluentui/web-components";

provideFluentDesignSystem().register(
  fluentDataGridCell(),
  fluentDataGridRow(),
  fluentDataGrid()
);

export function OverlappingSmes(
  overlappingSmeRequests: SmeRequest[]
): HTMLDivElement {
  const overlappingSmeWarningContainer = document.createElement("div");
  overlappingSmeWarningContainer.id = "overlappingSmeWarningContainer";
  overlappingSmeWarningContainer.innerHTML =
    "Selected SME has overlapping requests";
  const overlappingSmeList = document.createElement("ul");
  overlappingSmeWarningContainer.appendChild(overlappingSmeList);
  overlappingSmeRequests.forEach((request) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = request.name;
    overlappingSmeList.appendChild(listItem);
  });

  return overlappingSmeWarningContainer;
}

export function fluentOverlappingSmes(
  overlappingSmeRequests: SmeRequest[]
): void {
  console.debug("fluentOverlappingSmes");
  let gridElement: DataGrid | null = null;
  gridElement = document.getElementById("fluentOverlappingSmeGrid") as DataGrid;
  const overlappingSmeData: object[] = overlappingSmeRequests.map((request) => {
    return {
      name: request.name,
    };
  });
  gridElement.rowsData = overlappingSmeData;
  console.debug("fluentOverlappingSmes", gridElement);
}
