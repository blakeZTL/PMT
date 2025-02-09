
# Program Management Tool - SME Request Form Script

## Overview

The `sme-request.ts` script is designed to filter the available SMEs for a Resource Request in the SME Request form. It dynamically updates the lookup controls for the Requested SME and Assigned SME fields based on the selected Resource Request.

## Functionality

The script performs the following actions:

1. **Execution Context Check**: Ensures the execution context is defined.
2. **Publisher Prefix Check**: Validates that the publisher prefix is provided.
3. **Control Retrieval**: Retrieves the lookup controls for Requested SME and Resource Request.
4. **Resource Request ID Extraction**: Extracts the Resource Request ID from the form.
5. **FetchXML Query Construction**: Constructs a FetchXML query to retrieve available SMEs for the Resource Request.
6. **Custom View Addition**: Adds a custom view to the Requested SME and Assigned SME lookup controls based on the FetchXML query.

## Error Handling

The script logs errors to the console in the following scenarios:

- Undefined execution context.
- Missing publisher prefix.
- Missing or null lookup controls.
- Errors while adding custom views to the lookup controls.

## Example Usage

Here is an example of how to use the `filterRequestedSme` function:

```typescript
import { filterRequestedSme } from './forms/sme-request';

const executionContext = // Obtain the execution context from the form event
const publisherPrefix = 'pmt';

filterRequestedSme(executionContext, publisherPrefix);
```

## Conclusion

The `sme-request.ts` script enhances the SME Request form by dynamically filtering the available SMEs based on the selected Resource Request, ensuring that users can only select valid SMEs for their requests.
