# US11 Manual Test Checklist

## Overview
This checklist validates the US11 implementation for flow-based calculations and dynamic edge styling in the Financial Flow Tracker.

## Test Setup
1. Start the development server: `npm run dev`
2. Open the application in a browser at `http://localhost:5173`

## Scenario A: Basic Flow Calculation (Income → Expense → Status)
**Expected**: Work Income 2950 → Living Cost 2250 → Financial Status net 700

### Steps:
1. ✅ Verify initial setup shows:
   - Work Income: $2,950
   - Living Costs: $2,250
   - Two edges connecting: Work Income → Living Costs → Financial Status
2. ✅ Click on Financial Status to view breakdown
3. ✅ Verify Financial Status displays:
   - Income: $2,950
   - Expenses: $2,250
   - Net: $700 (displayed in green)
4. ✅ Verify breakdown shows:
   - Income Sources: "Living Costs (net): $700"
   - Expenses: "Living Costs: $2,250"

**Result**: ✅ PASSED

## Scenario B: Multiple Income Sources Aggregation
**Expected**: Multiple income sources should aggregate correctly

### Steps:
1. ✅ Add Freelance Income node (click "+ Add Freelance Income")
2. ✅ Double-click on Freelance Work value and set to $1,500
3. ✅ Verify Financial Status updates to:
   - Income: $4,450 (2,950 + 1,500)
   - Expenses: $2,250
   - Net: $2,200

**Result**: ✅ PASSED

## Scenario C: Expenses Greater Than Income (Negative Net)
**Expected**: When expenses exceed income, net should display as negative in red

### Steps:
1. ✅ Double-click on Living Costs value
2. ✅ Change Living Costs to $5,000
3. ✅ Verify Financial Status displays:
   - Income: $4,450
   - Expenses: $5,000
   - Net: -$550 (displayed in RED)
4. ✅ Verify flow calculation prevents negative flows:
   - "Living Costs (net): $0" (because $2,950 income - $5,000 expense = negative, capped at 0)

**Result**: ✅ PASSED

## Scenario D: Edge Styling Differences Based on Flow
**Expected**: Edge width and color intensity should scale with flow amount

### Steps:
1. ✅ Reset Living Costs to $2,250
2. ✅ Observe the two edges:
   - Edge 1 (Work Income → Living Costs): Should be THICK (flow: 2950)
   - Edge 2 (Living Costs → Financial Status): Should be THIN (flow: 700)
3. ✅ Verify edge properties via browser inspection:
   - Edge 1: strokeWidth ≈ 8 (maximum)
   - Edge 2: strokeWidth ≈ 1.9 (much smaller, proportional to flow)
4. ✅ Verify edges are animated (dotted appearance indicates animation)
5. ✅ Verify color intensity:
   - Thicker edge has lighter/more saturated green
   - Thinner edge has darker/less saturated color

**Result**: ✅ PASSED

## Additional Validation Tests

### Flow Computation Logic
- ✅ Income nodes output their value as flow
- ✅ Expense nodes deduct their value from incoming flow
- ✅ Flow is capped at 0 (never negative) using Math.max(0, ...)
- ✅ Financial Status aggregates all incoming flows correctly

### Edge Styling Properties
- ✅ Stroke width scales from 1px (minimum) to 8px (maximum)
- ✅ Color intensity scales with flow amount (30% to 100%)
- ✅ Edges with positive flow are animated
- ✅ Zero flow edges display in gray

### UI/UX Validation
- ✅ Financial Status shows detailed breakdown when clicked
- ✅ All node values are editable by double-clicking
- ✅ Node connections are preserved through value changes
- ✅ Calculations update reactively when values change

## Build Validation
- ✅ Production build succeeds: `npm run build`
- ✅ No console errors during development
- ✅ No TypeScript/ESLint errors

## Summary
All test scenarios PASSED ✅

### Key Achievements:
1. ✅ Flow amounts computed from outer nodes toward Financial Status
2. ✅ Intermediate expense nodes transform incoming amounts correctly
3. ✅ Financial Status summarizes totals from computed flows
4. ✅ Edge styling (width and color) scales with flow values
5. ✅ Negative net values display correctly in red
6. ✅ All calculations are reactive and update in real-time

### Screenshots:
- Scenario A: Basic flow (Net: $700) - Flow connected and working
- Scenario C: Negative net (Net: -$550) - Red text displayed correctly
- Scenario D: Edge styling differences - Visible width variations

## Notes
- The implementation uses recursive flow computation with memoization
- Edge styling uses dynamic RGB color calculation for intensity
- Flow computation prevents negative values using Math.max(0, ...)
- All existing UI components and features remain unchanged
