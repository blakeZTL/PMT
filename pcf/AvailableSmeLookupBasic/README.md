# AvailableSmeLookupBasic PCF Component

## Overview

The `AvailableSmeLookupBasic` is a PowerApps Component Framework (PCF) control that allows users to select an available SME (Subject Matter Expert) from a dropdown list. This control is designed to be used in model-driven apps.

## Features

- Fetches available SMEs from the specified entity.
- Displays the SMEs in a dropdown list.
- Allows users to select an SME and notifies the framework of the change.

## Installation

1. Clone the repository to your local machine.
2. Navigate to the `AvailableSmeLookupBasic` directory.
3. Install the dependencies using npm:
   ```sh
   npm install
   ```

## Usage

1. Build the PCF component:

   ```sh
   npm run build
   ```

2. Add the component to your model-driven app.

## Methods

### `init`

Initializes the control instance. This method is called once when the control is created.

**Parameters:**

- `context`: The entire property bag available to control via Context Object.
- `notifyOutputChanged`: A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
- `state`: A piece of data that persists in one session for a single user.
- `container`: An empty div element within which the control can render its content.

### `updateView`

Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.

**Parameters:**

- `context`: The entire property bag available to control via Context Object.

### `getOutputs`

Called by the framework prior to a control receiving new data. Returns an object based on nomenclature defined in the manifest.

### `destroy`

Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.

### `fetchData`

Fetches the available SMEs from the specified entity.

### `onChange`

Handles the change event when a new SME is selected from the dropdown.

**Parameters:**

- `newValue`: The newly selected SME.

## Files

### `index.ts`

The main file for the `AvailableSmeLookupBasic` PCF component.

### `components/CreateAvailableSmeSelect.ts`

Contains the `createAvailableSmeSelect` function which creates the dropdown select element for available SMEs.

## License

This project is licensed under the MIT License.
