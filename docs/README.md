# Documentation Directory

This directory contains the user story tracking and implementation documentation for the Financial Flow Tracker project.

## Files

### user-stories-tracker.csv
Excel-compatible tracking spreadsheet for monitoring implementation progress.

**Usage:**
1. Open directly in Excel or Google Sheets
2. Update the `Status` column as stories progress:
   - `Todo` - Not started
   - `In Progress` - Currently being worked on
   - `In Review` - PR submitted, awaiting review
   - `Done` - Merged to main branch
3. Fill in `Assigned To` with your name when starting a story
4. Add `PR URL` when PR is created
5. Use `Notes` for any important implementation details or blockers

### user-stories-and-tests.md
Complete specification of all 10 user stories with:
- User story descriptions in standard format
- Detailed acceptance criteria
- Step-by-step test cases for validation
- Suggested branch names
- Testing guidelines

## Implementation Workflow

### 1. Choose a Story
Start with US-FFT-001 and proceed in order (US-FFT-001 through US-FFT-010) as they have dependencies.

### 2. Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/US-FFT-001-airbnb-revenue-node
```
(Use the branch name specified in `user-stories-and-tests.md`)

### 3. Update Tracker
Open `user-stories-tracker.csv`:
- Set `Status` to "In Progress"
- Add your name to `Assigned To`

### 4. Implement
Follow the acceptance criteria in `user-stories-and-tests.md`. You can use GitHub Copilot:
```
Implement user story US-FFT-001 from docs/user-stories-and-tests.md.
Scope strictly to this story.
Meet all acceptance criteria.
Create/update tests needed for the listed test case.
Do not change unrelated behavior.
After coding, run relevant tests/build and summarize modified files.
```

### 5. Test Locally
```bash
npm run build
npm run dev
```
Follow the test case steps in `user-stories-and-tests.md`.

### 6. Commit and Push
```bash
git add .
git commit -m "feat: add Airbnb revenue node and main connection"
git push -u origin feature/US-FFT-001-airbnb-revenue-node
```

### 7. Create PR
```bash
gh pr create --base main --head feature/US-FFT-001-airbnb-revenue-node \
  --title "US-FFT-001: Airbnb revenue node" \
  --body "Implements US-FFT-001 from docs/user-stories-and-tests.md"
```

### 8. Update Tracker
After creating PR:
- Set `Status` to "In Review"
- Add PR URL to `PR URL` column

### 9. After Merge
- Set `Status` to "Done"
- Move to next story

## PR Checklist
Copy this into your PR description:
```
- [ ] Story ID referenced (US-FFT-xxx)
- [ ] Acceptance criteria fully implemented
- [ ] Test case from doc validated
- [ ] No unrelated files changed
- [ ] Build/tests pass locally
```

## Story Dependencies

The stories should be implemented in order as they build on each other:
1. US-FFT-001 - Adds first income node (baseline)
2. US-FFT-002 - Adds second income node (builds on 001)
3. US-FFT-003 - Adds expense node (completes basic structure)
4. US-FFT-004 - Adds calculations (needs all nodes from 001-003)
5. US-FFT-005 - Makes values editable (enhances all existing nodes)
6. US-FFT-006 - Adds deletion (needs calculation logic from 004)
7. US-FFT-007 - Makes labels editable (enhances all existing nodes)
8. US-FFT-008 - Adds detail panel (needs calculation from 004)
9. US-FFT-009 - Adds persistence (preserves all features from 001-008)
10. US-FFT-010 - Adds export (captures final state with all features)

## Questions?
See `user-stories-and-tests.md` for complete details on each story, or refer to the main project README.md for general project information.
