# Financial Flow Tracker - User Stories and Test Cases

This document defines all user stories for the Financial Flow Tracker application, including acceptance criteria and test cases for validation.

## Story Dependencies

Stories should be implemented in order (US-FFT-001 through US-FFT-010) as they build upon each other progressively.

---

## US-FFT-001: Airbnb Revenue Node and Main Connection

**As a** user with Airbnb rental income  
**I want** to add a specific Airbnb revenue node connected to my financial status  
**So that** I can track my short-term rental income separately from other income sources

### Acceptance Criteria
- [ ] A new "Airbnb Revenue" income node is created with appropriate styling (green border/background)
- [ ] The node displays a label "Airbnb Revenue" and a sample amount (e.g., "+$1,200")
- [ ] The node is automatically connected to the central "Financial Status" node with an edge
- [ ] The connection edge is visible and properly styled
- [ ] Node can be dragged and repositioned while maintaining the connection

### Test Case
1. Load the application
2. Verify an "Airbnb Revenue" node exists on the canvas
3. Verify it has green styling (background: #D1FAE5, border: #10B981)
4. Verify it displays "+$1,200" or similar amount
5. Verify an edge connects it to the "Financial Status" node
6. Drag the node and verify the edge follows the movement

**Branch name:** `feature/US-FFT-001-airbnb-revenue-node`

---

## US-FFT-002: Freelance Income Node with Connection

**As a** freelance worker  
**I want** to add a freelance income node connected to my financial status  
**So that** I can separately track my contract and project-based income

### Acceptance Criteria
- [ ] A new "Freelance Work" income node is created with green styling
- [ ] The node displays a label "Freelance Work" and a sample amount (e.g., "+$2,100")
- [ ] The node is automatically connected to the central "Financial Status" node
- [ ] Multiple income nodes (Work Income, Airbnb, Freelance) can coexist
- [ ] All income nodes maintain their individual connections to the main node

### Test Case
1. Load the application
2. Verify both "Airbnb Revenue" and "Freelance Work" nodes exist
3. Verify "Freelance Work" has green styling and displays "+$2,100"
4. Verify edges connect both income nodes to "Financial Status"
5. Verify no visual overlap between nodes
6. Test dragging multiple nodes independently

**Branch name:** `feature/US-FFT-002-freelance-income-node`

---

## US-FFT-003: Savings Goal Expense Node

**As a** user focused on saving money  
**I want** to add a "Savings Goal" expense node connected from my financial status  
**So that** I can visualize my savings as a planned allocation of funds

### Acceptance Criteria
- [ ] A new "Savings Goal" expense node is created with red styling
- [ ] The node displays a label "Savings Goal" and a sample amount (e.g., "-$1,500")
- [ ] An edge connects from "Financial Status" to the "Savings Goal" node
- [ ] The savings node uses the same styling as other expense nodes (background: #FEE2E2, border: #EF4444)
- [ ] Multiple expense nodes can coexist without overlap

### Test Case
1. Load the application
2. Verify "Savings Goal" expense node exists alongside "Living Costs"
3. Verify it has red styling and displays "-$1,500"
4. Verify an edge connects from "Financial Status" to "Savings Goal"
5. Verify both expense nodes are visually distinct and positioned appropriately
6. Test that edges from status node flow to both expense nodes

**Branch name:** `feature/US-FFT-003-savings-goal-node`

---

## US-FFT-004: Dynamic Edge Color Based on Net Value

**As a** user monitoring my financial health  
**I want** the final edge color to change based on whether I have positive or negative net value  
**So that** I can quickly see if my income exceeds my expenses

### Acceptance Criteria
- [ ] Calculate total income from all income nodes
- [ ] Calculate total expenses from all expense nodes
- [ ] Determine net value (income - expenses)
- [ ] Add a final "Net Result" node showing the calculated net value
- [ ] The edge connecting "Financial Status" to "Net Result" is green if net > 0
- [ ] The edge is red if net < 0
- [ ] The edge is gray if net = 0
- [ ] Net value updates dynamically if node values change

### Test Case
1. Load the application
2. Verify a "Net Result" node exists showing calculated net value
3. With sample data (total income > expenses), verify edge to "Net Result" is green
4. Manually calculate: Income ($3,500 + $1,200 + $2,100) - Expenses ($2,200 + $1,500) = $3,100
5. Verify "Net Result" displays "+$3,100"
6. Verify the connecting edge is green (#10B981)

**Branch name:** `feature/US-FFT-004-dynamic-edge-color`

---

## US-FFT-005: Editable Node Values

**As a** user with changing income and expenses  
**I want** to edit the monetary values on nodes by clicking them  
**So that** I can update my financial tracking as my situation changes

### Acceptance Criteria
- [ ] Double-clicking a node opens an edit interface
- [ ] User can enter a new numeric value for the node
- [ ] Pressing Enter saves the new value
- [ ] Pressing Escape cancels the edit
- [ ] The node label updates to show the new value
- [ ] Net value and edge colors recalculate based on updated values
- [ ] Only numeric values (with optional decimal points) are accepted

### Test Case
1. Load the application
2. Double-click the "Airbnb Revenue" node
3. Enter a new value "1500"
4. Press Enter
5. Verify node displays "+$1,500"
6. Verify "Net Result" recalculates: ($3,500 + $1,500 + $2,100) - ($2,200 + $1,500) = $3,400
7. Verify edge color remains green
8. Test canceling an edit with Escape key

**Branch name:** `feature/US-FFT-005-editable-node-values`

---

## US-FFT-006: Node Deletion with Recalculation

**As a** user managing my financial nodes  
**I want** to delete nodes I no longer need  
**So that** I can keep my flow diagram clean and relevant

### Acceptance Criteria
- [ ] Clicking/selecting a node shows a delete button or allows Delete key press
- [ ] Pressing Delete key removes the selected node
- [ ] All edges connected to the deleted node are also removed
- [ ] Net value recalculates after node deletion
- [ ] Edge colors update based on new net value
- [ ] The central "Financial Status" node cannot be deleted
- [ ] Undo functionality is not required (out of scope)

### Test Case
1. Load the application
2. Click to select the "Living Costs" expense node
3. Press Delete key
4. Verify the node is removed from the canvas
5. Verify its connecting edge is also removed
6. Verify "Net Result" recalculates: ($3,500 + $1,500 + $2,100) - ($1,500) = $5,600
7. Verify edge color is green
8. Try to delete "Financial Status" and verify it's protected

**Branch name:** `feature/US-FFT-006-node-deletion`

---

## US-FFT-007: Custom Node Labels

**As a** user with diverse income and expense sources  
**I want** to customize the label/name of nodes  
**So that** I can accurately describe my specific financial flows

### Acceptance Criteria
- [ ] Double-clicking a node's label area opens an edit interface for the label
- [ ] User can enter custom text for the node name
- [ ] Pressing Enter saves the new label
- [ ] Pressing Escape cancels the edit
- [ ] The node displays the updated label
- [ ] Labels can include spaces and special characters
- [ ] Maximum label length is enforced (e.g., 30 characters)

### Test Case
1. Load the application
2. Double-click the "Airbnb Revenue" node label
3. Enter "Vacation Rental - Miami"
4. Press Enter
5. Verify node displays "Vacation Rental - Miami"
6. Verify the monetary value remains unchanged
7. Test editing another node with a longer label
8. Verify long labels are truncated or wrapped appropriately

**Branch name:** `feature/US-FFT-007-custom-node-labels`

---

## US-FFT-008: Main Status Box Breakdown Panel

**As a** user wanting detailed insights  
**I want** to click the "Financial Status" node to see a detailed breakdown  
**So that** I can view a summary of all my income and expense contributions

### Acceptance Criteria
- [ ] Clicking the "Financial Status" node opens a side panel or modal
- [ ] Panel displays a list of all income sources with their values
- [ ] Panel displays a list of all expense sources with their values
- [ ] Panel shows calculated total income
- [ ] Panel shows calculated total expenses
- [ ] Panel shows net value with color coding (green if positive, red if negative)
- [ ] Panel can be closed by clicking outside or a close button
- [ ] Panel updates in real-time as values change

### Test Case
1. Load the application
2. Click the "Financial Status" node
3. Verify a breakdown panel appears
4. Verify it lists all income nodes with their values
5. Verify it lists all expense nodes with their values
6. Verify total income sum is correct
7. Verify total expenses sum is correct
8. Verify net value calculation is correct
9. Close panel and verify it disappears

**Branch name:** `feature/US-FFT-008-status-breakdown-panel`

---

## US-FFT-009: Local Storage Persistence

**As a** user who frequently updates my financial tracking  
**I want** my flow diagram to be saved automatically  
**So that** I don't lose my data when I close and reopen the browser

### Acceptance Criteria
- [ ] All nodes (positions, labels, values) are saved to browser localStorage
- [ ] All edges are saved to browser localStorage
- [ ] Data is saved automatically whenever changes occur (debounced)
- [ ] On page load, saved data is restored if available
- [ ] If no saved data exists, default initial nodes are shown
- [ ] A "Clear All Data" button allows users to reset to defaults
- [ ] Saving occurs without noticeable performance impact

### Test Case
1. Load the application and make changes (add nodes, edit values)
2. Refresh the browser
3. Verify all nodes and edges are restored
4. Verify custom labels and values are preserved
5. Verify node positions are maintained
6. Click "Clear All Data" button
7. Verify application resets to initial default state
8. Refresh and verify defaults persist

**Branch name:** `feature/US-FFT-009-local-storage-persistence`

---

## US-FFT-010: Export Flow as Image

**As a** user wanting to share my financial flow  
**I want** to export my flow diagram as an image file  
**So that** I can include it in reports or share it with others

### Acceptance Criteria
- [ ] An "Export as Image" button is visible in the UI
- [ ] Clicking the button generates a PNG image of the current flow diagram
- [ ] The image includes all visible nodes and edges
- [ ] The image has a white or transparent background
- [ ] The image is automatically downloaded to the user's device
- [ ] File is named with a timestamp (e.g., "financial-flow-2026-02-13.png")
- [ ] Image quality is sufficient for viewing and printing (minimum 1920x1080)

### Test Case
1. Load the application with custom nodes and connections
2. Click "Export as Image" button
3. Verify a PNG file is downloaded
4. Open the downloaded image
5. Verify all nodes are visible and readable
6. Verify all edges are visible
7. Verify image quality is high
8. Verify filename includes date/timestamp
9. Test export with different zoom levels and canvas positions

**Branch name:** `feature/US-FFT-010-export-as-image`

---

## Testing Guidelines

### Manual Testing
For each story, perform the test case steps manually in a development environment:
```bash
npm run dev
```

### Build Validation
After implementing each story, ensure the build succeeds:
```bash
npm run build
```

### Cross-Browser Testing (Optional)
Test in at least two browsers (e.g., Chrome and Firefox) to ensure compatibility.

### Regression Testing
When implementing later stories, verify earlier functionality still works:
- Income and expense node creation
- Dragging and connecting nodes
- Visual styling remains consistent
- No console errors appear

---

## Notes

- All monetary values should display with 2 decimal places for consistency
- Currency symbol ($) should precede amounts
- Positive values (income) should show with a "+" prefix
- Negative values (expenses) should show with a "-" prefix
- Node IDs should be unique and auto-incrementing
- Edge IDs should follow the pattern "e{sourceId}-{targetId}"
