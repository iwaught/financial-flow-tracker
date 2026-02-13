# Workflow Guide for Financial Flow Tracker

This guide describes the recommended workflow for implementing user stories in the Financial Flow Tracker project using GitHub Copilot and proper git practices.

## Overview

This project uses a story-driven development approach with 10 user stories (US-FFT-001 through US-FFT-010). Each story is tracked, implemented on a feature branch, and merged via pull request.

## Tracker File for Excel

Use `docs/user-stories-tracker.csv` as the planning and execution tracker.

- Open it directly in Excel or any spreadsheet application.
- Update `Status` as `Todo`, `In Progress`, `In Review`, `Done`.
- Fill `Assigned To`, `PR URL`, and `Notes` while each story advances.
- Keep one row per story ID (US-FFT-001 to US-FFT-010).

## Implementation Workflow

### 1) Create Branch from Story ID

From project root:

```bash
git checkout main
git pull origin main
git checkout -b feature/US-FFT-001-airbnb-revenue-node
```

Repeat for each story by replacing branch name with the mapped one in `docs/user-stories-and-tests.md`.

**Branch Naming Convention:**
- Format: `feature/US-FFT-XXX-short-description`
- Example: `feature/US-FFT-004-dynamic-edge-color`
- See branch mapping table in `docs/user-stories-and-tests.md`

### 2) Give the Story to Copilot Agent

Use this prompt template inside VS Code Copilot Chat Agent mode:

```text
Implement user story US-FFT-001 from docs/user-stories-and-tests.md.
Scope strictly to this story.
Meet all acceptance criteria.
Create/update tests needed for the listed test case.
Do not change unrelated behavior.
After coding, run relevant tests/build and summarize modified files.
```

**Tips for Working with Copilot:**
- Reference the specific story ID in your prompt
- Point Copilot to `docs/user-stories-and-tests.md` for context
- Ask Copilot to explain changes if needed
- Review all generated code before committing

### 3) Verify Locally

Run lightweight checks before commit:

```bash
npm run build
npm run dev
```

**Manual Testing:**
- Open http://localhost:5173 in your browser
- Test the specific feature implemented
- Verify existing features still work
- Check console for errors

If you add automated tests later, also run:

```bash
npm test
```

### 4) Commit with Short Story-Based Message

```bash
git add .
git commit -m "feat: add Airbnb revenue node and main connection"
```

**Commit Message Guidelines:**
- Use conventional commit format
- Keep first line under 72 characters
- Reference story ID in longer commit body if needed

### 5) Push and Open PR

Using GitHub CLI:

```bash
git push -u origin feature/US-FFT-001-airbnb-revenue-node
gh pr create --base main --head feature/US-FFT-001-airbnb-revenue-node --title "US-FFT-001: Airbnb revenue node" --body "Implements US-FFT-001 from docs/user-stories-and-tests.md"
```

**Alternative - Browser UI:**
1. Push branch: `git push -u origin feature/US-FFT-001-airbnb-revenue-node`
2. Navigate to repository on GitHub
3. Click **Compare & pull request** button
4. Fill in title and description using format below

**PR Title Format:**
```
US-FFT-001: Airbnb revenue node and main connection
```

**PR Description Template:**
```markdown
## Story
Implements US-FFT-001 from `docs/user-stories-and-tests.md`

## Changes
- Added "Add Airbnb Income" button
- Created Airbnb revenue node with green styling
- Implemented connection to main status node
- Added default value display

## Testing
- [x] Manual testing completed
- [x] Build passes (`npm run build`)
- [x] Acceptance criteria met
- [x] Test case TC-FFT-001 validated

## Related
Closes #X (if there's a related issue)
```

### 6) Merge Strategy

For personal projects, either strategy is fine:
- **Squash merge**: Cleaner history (1 commit per story in `main`)
  - Recommended for this project
  - Keeps main branch timeline focused on stories
- **Merge commit**: Preserves all individual commits
  - Use if you want detailed commit history preserved

**After Merge:**
1. Delete the feature branch (GitHub offers this automatically)
2. Update tracker CSV: change status to "Done", add PR URL
3. Pull latest main: `git checkout main && git pull origin main`

### 7) Recommended Implementation Order

Use this dependency-aware order:

1. **US-FFT-001** - Airbnb revenue node (establishes income pattern)
2. **US-FFT-002** - Freelance income node (more income sources)
3. **US-FFT-003** - Rent expense node (establishes expense pattern)
4. **US-FFT-004** - Dynamic edge color (requires multiple nodes)
5. **US-FFT-005** - Editable node values (foundation for calculations)
6. **US-FFT-006** - Main status calculation (uses editable values)
7. **US-FFT-007** - Save/load state (build on stable features)
8. **US-FFT-008** - Contribution breakdown panel (advanced feature)
9. **US-FFT-009** - Delete nodes (cleanup functionality)
10. **US-FFT-010** - Custom labels (enhancement)

**Why This Order:**
- Early stories establish patterns (node creation, styling)
- Middle stories add core features (values, calculations)
- Later stories add advanced features (save/load, analytics)
- Dependencies are respected (e.g., 006 needs 005)

### 8) PR Checklist

Copy/paste this checklist into each PR description:

```markdown
- [ ] Story ID referenced (US-FFT-XXX)
- [ ] Acceptance criteria fully implemented
- [ ] Test case from doc validated
- [ ] No unrelated files changed
- [ ] Build/tests pass locally (`npm run build`)
- [ ] Manual testing completed
- [ ] Screenshots/videos attached (if UI changes)
- [ ] Tracker CSV updated
```

### 9) Suggested PR Title Format

Format: `US-FFT-XXX: Short story description`

**Examples:**
- `US-FFT-001: Airbnb revenue node and main connection`
- `US-FFT-004: Dynamic final edge color by net value`
- `US-FFT-008: Main box contribution breakdown panel`
- `US-FFT-010: Custom node labels`

**Title Guidelines:**
- Always start with story ID
- Keep description concise but clear
- Match the story name from tracker CSV
- Use title case

### 10) Suggested Commit Style

Use short, action-based commits following conventional commits:

**Commit Types:**
- `feat:` for new functionality
  - Example: `feat: add Airbnb revenue node button`
- `fix:` for bug corrections during the same story
  - Example: `fix: correct edge color calculation`
- `test:` for test additions/updates
  - Example: `test: add TC-FFT-001 validation`
- `docs:` for documentation changes
  - Example: `docs: update README with new features`
- `refactor:` for code restructuring
  - Example: `refactor: extract node creation logic`
- `style:` for formatting/styling only
  - Example: `style: apply Tailwind to new components`

**Commit Message Best Practices:**
- Keep first line under 72 characters
- Use imperative mood ("add" not "added")
- Be specific about what changed
- Reference story ID in body if needed

**Example:**
```bash
git commit -m "feat: add dynamic edge coloring

Implements US-FFT-004 acceptance criteria:
- Calculates net value from connected nodes
- Changes edge color based on positive/negative
- Updates dynamically as connections change"
```

Keep each branch focused on one story only.

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Dev Server Won't Start
```bash
# Check if port 5173 is in use
lsof -i :5173
# Kill process if needed, then restart
npm run dev
```

### Git Conflicts
```bash
# Update your feature branch with latest main
git checkout main
git pull origin main
git checkout feature/US-FFT-XXX-your-branch
git merge main
# Resolve conflicts in your editor
git add .
git commit -m "merge: resolve conflicts with main"
```

### Copilot Not Working
- Ensure GitHub Copilot extension is installed and active
- Check your GitHub Copilot subscription status
- Restart VS Code if suggestions aren't appearing
- Review `.github/copilot-instructions.md` for project-specific context

## Project-Specific Notes

### Current Tech Stack
- **React 18.2.0**: UI framework
- **Vite 5.0.8**: Build tool (fast HMR)
- **ReactFlow 11.10.4**: Flow diagram library
- **Tailwind CSS 3.4.0**: Utility-first styling

### Code Style
- Use functional components with hooks
- Follow existing Tailwind utility patterns
- Maintain consistent node color scheme:
  - Income: Green (#10B981 border, #D1FAE5 background)
  - Expense: Red (#EF4444 border, #FEE2E2 background)
  - Status: Blue (#0284C7 border, #E0F2FE background)

### Testing Strategy
Currently manual testing only. When adding tests:
- Use Jest + React Testing Library (when added)
- Follow existing test patterns
- Test both user interactions and state changes

## Quick Reference

**Clone and Setup:**
```bash
git clone https://github.com/iwaught/financial-flow-tracker.git
cd financial-flow-tracker
npm install
```

**Start Development:**
```bash
npm run dev
```

**Build and Preview:**
```bash
npm run build
npm run preview
```

**Create Feature Branch:**
```bash
git checkout -b feature/US-FFT-XXX-short-desc
```

**Commit and Push:**
```bash
git add .
git commit -m "feat: your change description"
git push -u origin feature/US-FFT-XXX-short-desc
```

**Open PR:**
```bash
gh pr create --base main --head feature/US-FFT-XXX-short-desc --title "US-FFT-XXX: Title" --body "Description"
```

## Resources

- User Stories: `docs/user-stories-and-tests.md`
- Tracker: `docs/user-stories-tracker.csv`
- README: `README.md`
- Copilot Instructions: `.github/copilot-instructions.md`

For questions or issues, open a GitHub issue or discussion.
