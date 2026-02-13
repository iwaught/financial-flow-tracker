# US-FFT-013: Import Password-Protected Credit Card Statement PDF to Auto-Create Expense Node

## Story

**As a** user tracking high monthly credit card costs  
**I want** to upload my password-protected statement PDF and have the app extract payment amounts from both cards, detect currency, convert to USD using the daily spot rate, and auto-create/update a red credit card expense box  
**So that** I can quickly keep my financial flow accurate without manually retyping statement totals

## Acceptance Criteria

1. User can select PDF and enter password
2. Password-protected PDF can be parsed
3. Payment amounts are extracted for up to 2 cards
4. Currency detected per amount
5. Non-USD converted using daily spot to USD
6. `Credit Card Expense` node created if not present
7. Existing imported node updated (no duplicates)
8. Node connected to main status node
9. Success/error feedback visible and understandable

## Implementation Details

### In Scope
1. UI controls to import statement PDF:
   - PDF file input
   - Password input
   - Import button
2. Parse **password-protected PDF** in-browser
3. Extract monthly card payment amounts for up to 2 cards
4. Detect currency for each extracted amount
5. Convert all non-USD amounts to USD with **daily spot FX**
6. Sum converted amounts and create/update one red expense node:
   - Label: `Credit Card Expense`
   - Node type: `expense`
7. Ensure node is connected to main status node
8. Show clear success/error messages

### Out of Scope
- OCR/image-based extraction
- Backend/server components
- New node types beyond expense
- New screens/routes

## Technical Implementation

### PDF Parsing
- Use `pdfjs-dist` library for browser-compatible PDF parsing
- Support encrypted PDFs by passing user password
- Graceful failure with user-facing message if password is wrong

### Payment Extraction
- Search statement text for payment keywords (e.g., `payment due`, `total payment`, `amount due`)
- Parse numeric values robustly with comma/dot separators
- Detect currency from ISO code (`USD`, `EUR`, etc.) or symbols (`$`, `€`, `£`, `¥`)
- Choose up to top 2 best payment candidates

### FX Conversion to USD
- If currency is USD, rate is `1`
- For non-USD, fetch daily spot rate from Frankfurter API
- Convert each amount and sum to USD total
- Round to 2 decimals

### Node Upsert Logic
- Reuse existing imported node when possible (by `importSource` marker)
- If missing, create a new red expense node:
  - Background: `#FEE2E2`
  - Border: `2px solid #EF4444`
- Ensure edge exists from imported node to main status node (`id: '1'`)

### Feedback UX
- Show import progress state (`Importing...`)
- Show success summary including:
  - Number of extracted payments
  - Converted USD total
  - FX date if available
- Show clear errors for:
  - Missing file/password
  - Wrong password
  - No payment amount found
  - FX lookup failure

## Test Case TC-FFT-013

1. Start app with `npm run dev`
2. Import a password-protected PDF with 2 payment values (at least one non-USD)
3. Verify:
   - Import succeeds
   - USD total equals sum of converted values
   - Red `Credit Card Expense` node appears/updates
   - Node is connected to main status node
4. Re-import with changed statement values:
   - Same node updates, no duplicate
5. Try wrong password:
   - Error shown
   - No graph changes applied

## Branch Name
`feature/US-FFT-013-credit-card-pdf-import`

## Status
In Progress
