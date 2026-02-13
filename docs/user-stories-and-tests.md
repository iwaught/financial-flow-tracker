# User Stories and Test Cases

This document contains all user stories for the Financial Flow Tracker project, along with their acceptance criteria and test cases.

## Story US-FFT-001: Airbnb Revenue Node and Main Connection

**As a** user managing multiple income sources  
**I want** to add an Airbnb revenue node that connects to my main financial status  
**So that** I can track my Airbnb income separately from other sources

### Acceptance Criteria
1. A new "Add Airbnb Income" button exists in the UI
2. Clicking the button creates a green income node labeled "Airbnb Revenue"
3. The node can be connected to the main financial status (blue) node
4. The node has a default value display (e.g., "$0")
5. The connection edge is visible and styled consistently

### Test Case TC-FFT-001
- **Setup**: Open the application
- **Action**: Click "Add Airbnb Income" button
- **Expected**: 
  - New green node appears labeled "Airbnb Revenue"
  - Node can be dragged and positioned
  - Node can connect to main status node
  - Connection renders with appropriate styling

### Branch Name
`feature/US-FFT-001-airbnb-revenue-node`

---

## Story US-FFT-002: Freelance Income Node

**As a** freelancer tracking multiple income streams  
**I want** to add a freelance income node  
**So that** I can visualize my freelance earnings separately

### Acceptance Criteria
1. A new "Add Freelance Income" button exists in the UI
2. Clicking the button creates a green income node labeled "Freelance Work"
3. The node can be connected to the main financial status node
4. The node has an editable value field
5. Multiple freelance nodes can be created

### Test Case TC-FFT-002
- **Setup**: Open the application
- **Action**: Click "Add Freelance Income" button multiple times
- **Expected**: 
  - Multiple green nodes appear, each labeled "Freelance Work"
  - Each node has a unique ID
  - All nodes can connect to the main status node

### Branch Name
`feature/US-FFT-002-freelance-income-node`

---

## Story US-FFT-003: Rent Expense Node

**As a** user tracking my monthly expenses  
**I want** to add a rent expense node  
**So that** I can visualize my largest fixed expense

### Acceptance Criteria
1. A new "Add Rent Expense" button exists in the UI
2. Clicking the button creates a red expense node labeled "Rent"
3. The main status node can connect to the rent expense node
4. The node has an editable value field for the monthly amount
5. The expense is visually distinct from income nodes (red vs green)

### Test Case TC-FFT-003
- **Setup**: Open the application with main status node visible
- **Action**: Click "Add Rent Expense" button
- **Expected**: 
  - New red node appears labeled "Rent"
  - Node styling clearly indicates it's an expense (red border/background)
  - Connection can be made from main status to rent expense

### Branch Name
`feature/US-FFT-003-rent-expense-node`

---

## Story US-FFT-004: Dynamic Final Edge Color by Net Value

**As a** user analyzing my financial health  
**I want** the connection from main status to expenses to change color based on whether I have positive or negative net value  
**So that** I can quickly see if I'm spending within my means

### Acceptance Criteria
1. Calculate total income from all income nodes connected to main status
2. Calculate total expenses from all expense nodes connected from main status
3. If net value (income - expenses) is positive, final edges are green
4. If net value is negative, final edges are red
5. If net value is zero, final edges are neutral (gray or blue)
6. Color updates dynamically as connections change

### Test Case TC-FFT-004
- **Setup**: Create 1 income node ($1000) and 1 expense node ($500) connected to main
- **Action**: Observe the edge colors
- **Expected**: 
  - Edge from income to main is green
  - Edge from main to expense shows green (positive net)
- **Action**: Add another expense node ($600)
- **Expected**: Edge from main to new expense shows red (negative net)

### Branch Name
`feature/US-FFT-004-dynamic-edge-color`

---

## Story US-FFT-005: Editable Node Values

**As a** user tracking specific amounts  
**I want** to edit the monetary value on each income and expense node  
**So that** I can accurately represent my financial situation

### Acceptance Criteria
1. Each income and expense node displays an editable value field
2. Double-clicking or clicking an edit icon allows value editing
3. Values are formatted as currency (e.g., "$1,234.56")
4. Invalid inputs (non-numeric) are rejected or sanitized
5. Updated values persist during the session
6. Main status node shows calculated total based on inputs

### Test Case TC-FFT-005
- **Setup**: Create an Airbnb income node
- **Action**: Click on the value field and enter "2500"
- **Expected**: 
  - Value displays as "$2,500.00" or similar formatted currency
  - Main status node updates to reflect this income
  - Value persists when the node is moved

### Branch Name
`feature/US-FFT-005-editable-node-values`

---

## Story US-FFT-006: Main Status Box Calculation

**As a** user monitoring my overall financial position  
**I want** the main status box to automatically calculate and display my net value  
**So that** I can see my financial health at a glance

### Acceptance Criteria
1. Main status node displays total income from all connected income nodes
2. Main status node displays total expenses from all connected expense nodes
3. Main status node displays net value (income - expenses)
4. Calculations update in real-time as node values change
5. Display is formatted clearly (e.g., "Net: $500" or "Balance: -$200")
6. Visual indicator shows positive (green) or negative (red) status

### Test Case TC-FFT-006
- **Setup**: Create 2 income nodes ($1000, $500) and 1 expense node ($800)
- **Action**: Connect all to main status node
- **Expected**: 
  - Main status shows "Total Income: $1,500"
  - Main status shows "Total Expenses: $800"
  - Main status shows "Net: $700" in green

### Branch Name
`feature/US-FFT-006-main-status-calculation`

---

## Story US-FFT-007: Save and Load Flow State

**As a** user building my financial flow over time  
**I want** to save my current flow diagram and load it later  
**So that** I don't lose my work between sessions

### Acceptance Criteria
1. A "Save" button exports the current flow state to local storage or JSON file
2. A "Load" button imports a previously saved flow state
3. All nodes, edges, positions, and values are preserved
4. User receives confirmation when save/load is successful
5. Invalid or corrupted save data shows appropriate error message

### Test Case TC-FFT-007
- **Setup**: Create a complete flow with 3 income and 2 expense nodes
- **Action**: Click "Save" button
- **Expected**: Success message appears
- **Action**: Refresh page and click "Load" button
- **Expected**: 
  - All nodes reappear in same positions
  - All connections are restored
  - All values are preserved

### Branch Name
`feature/US-FFT-007-save-load-state`

---

## Story US-FFT-008: Main Box Contribution Breakdown Panel

**As a** user analyzing my income and expense composition  
**I want** a detailed breakdown panel showing each connected node's contribution  
**So that** I can understand the percentage breakdown of my finances

### Acceptance Criteria
1. A panel or tooltip shows when hovering/clicking the main status node
2. Panel lists all income sources with their amounts and percentages
3. Panel lists all expenses with their amounts and percentages
4. Percentages are calculated relative to total income or total expenses
5. Panel updates dynamically as values or connections change
6. Panel is visually clear and easy to read

### Test Case TC-FFT-008
- **Setup**: Create income nodes: Airbnb ($1000), Freelance ($500)
- **Action**: Click on main status node
- **Expected**: 
  - Panel shows "Airbnb: $1,000 (66.7%)"
  - Panel shows "Freelance: $500 (33.3%)"
  - Panel shows "Total Income: $1,500"

### Branch Name
`feature/US-FFT-008-contribution-breakdown-panel`

---

## Story US-FFT-009: Delete Nodes and Connections

**As a** user refining my financial model  
**I want** to delete nodes and connections I no longer need  
**So that** I can keep my flow diagram clean and accurate

### Acceptance Criteria
1. Each node has a delete button or responds to delete key when selected
2. Deleting a node also removes all its connections
3. User sees confirmation dialog before deletion (optional but recommended)
4. Deleted nodes are removed from calculations immediately
5. Main status node cannot be deleted
6. Undo functionality would be a bonus

### Test Case TC-FFT-009
- **Setup**: Create 3 income nodes connected to main
- **Action**: Select one income node and press delete key (or click delete icon)
- **Expected**: 
  - Node disappears from canvas
  - Connection to main status is removed
  - Main status calculation updates to exclude deleted node
  - Remaining nodes are unaffected

### Branch Name
`feature/US-FFT-009-delete-nodes-connections`

---

## Story US-FFT-010: Custom Node Labels

**As a** user with specific income sources and expenses  
**I want** to customize the label/name of each node  
**So that** I can represent my unique financial situation accurately

### Acceptance Criteria
1. Each node has an editable label field (separate from value)
2. Double-clicking label allows editing
3. Label updates are reflected immediately in the node
4. Labels are preserved in save/load functionality
5. Labels can be any text (e.g., "Side Hustle Income", "Car Payment")
6. Default labels are still provided for new nodes

### Test Case TC-FFT-010
- **Setup**: Create a generic income node (default label: "Income Source")
- **Action**: Double-click the label and enter "YouTube Revenue"
- **Expected**: 
  - Node label updates to "YouTube Revenue"
  - Label persists when node is moved
  - Label is saved/loaded correctly
- **Action**: Create another income node and leave default label
- **Expected**: New node shows default label "Income Source" with unique ID

### Branch Name
`feature/US-FFT-010-custom-node-labels`

---

## Branch-to-Story Mapping Summary

| Story ID | Branch Name | Short Description |
|----------|-------------|-------------------|
| US-FFT-001 | feature/US-FFT-001-airbnb-revenue-node | Airbnb revenue node and main connection |
| US-FFT-002 | feature/US-FFT-002-freelance-income-node | Freelance income node |
| US-FFT-003 | feature/US-FFT-003-rent-expense-node | Rent expense node |
| US-FFT-004 | feature/US-FFT-004-dynamic-edge-color | Dynamic final edge color by net value |
| US-FFT-005 | feature/US-FFT-005-editable-node-values | Editable node values |
| US-FFT-006 | feature/US-FFT-006-main-status-calculation | Main status box calculation |
| US-FFT-007 | feature/US-FFT-007-save-load-state | Save and load flow state |
| US-FFT-008 | feature/US-FFT-008-contribution-breakdown-panel | Main box contribution breakdown panel |
| US-FFT-009 | feature/US-FFT-009-delete-nodes-connections | Delete nodes and connections |
| US-FFT-010 | feature/US-FFT-010-custom-node-labels | Custom node labels |

---

## Implementation Notes

### Dependencies Between Stories
- **US-FFT-001, 002, 003**: Can be implemented independently, establish the node creation pattern
- **US-FFT-004**: Depends on having multiple nodes (001, 002, 003)
- **US-FFT-005**: Should be implemented before or alongside 006
- **US-FFT-006**: Depends on 005 for value inputs
- **US-FFT-007**: Should come after core functionality is stable
- **US-FFT-008**: Depends on 006 for calculation logic
- **US-FFT-009**: Can be implemented anytime after node creation
- **US-FFT-010**: Can be implemented anytime, enhances existing nodes

### Recommended Implementation Order
Follow the order listed in the problem statement (US-FFT-001 through US-FFT-010) as it builds features incrementally from basic to advanced.
