# GitHub Copilot Instructions for Financial Flow Tracker

## Project Overview

Financial Flow Tracker is an interactive React application that helps users visualize money flows between income sources, expenses, and their central financial status using interactive flow diagrams.

## Tech Stack

- **React**: 18.2.0 - UI framework
- **Vite**: 5.0.8 - Fast development build tool and bundler
- **ReactFlow**: 11.10.4 - Interactive flow diagrams with drag & drop
- **Tailwind CSS**: 3.4.0 - Utility-first CSS framework
- **JavaScript**: ES6+ with JSX

## Project Structure

```
financial-flow-tracker/
├── src/
│   ├── components/
│   │   └── FlowCanvas.jsx    # Main flow diagram component
│   ├── App.jsx                # Root application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── index.html                 # HTML entry point
├── package.json               # Project dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── postcss.config.js          # PostCSS configuration
```

## Development Commands

- **Start dev server**: `npm run dev` (runs on http://localhost:5173)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Code Style and Conventions

### React Components

- Use **functional components** with hooks (useState, useCallback, useRef, etc.)
- Component files use `.jsx` extension
- Components use PascalCase naming (e.g., `FlowCanvas.jsx`, `App.jsx`)
- Export components as default exports
- Use React.memo() for performance optimization when appropriate

### JavaScript Style

- Use ES6+ features (arrow functions, destructuring, spread operators)
- Use `const` and `let`, avoid `var`
- Prefer template literals for string interpolation
- Use meaningful variable names that describe the data or purpose

### State Management

- Use React hooks for state management:
  - `useNodesState` and `useEdgesState` from ReactFlow for node/edge state
  - `useRef` for mutable values that don't trigger re-renders
  - `useCallback` to memoize callback functions
- Keep state as close to where it's used as possible

### Styling

- Use **Tailwind CSS** utility classes for all styling
- Color scheme for nodes:
  - **Income nodes**: Green (#10B981 border, #D1FAE5 background)
  - **Expense nodes**: Red (#EF4444 border, #FEE2E2 background)
  - **Status nodes**: Blue (#0284C7 border, #E0F2FE background)
- Use Tailwind's responsive design utilities when needed
- Common utility patterns:
  - Flexbox: `flex gap-3`
  - Padding: `px-4 py-2`, `p-4`
  - Rounded corners: `rounded-lg`
  - Shadows: `shadow-lg`
  - Transitions: `transition-colors duration-200`

### ReactFlow Specific

- Nodes should have unique `id` fields
- Node data includes a `nodeType` field ('income', 'expense', or 'status')
- Use inline styles for node-specific styling (background, border, etc.)
- Labels can be React components for rich formatting
- MiniMap colors match node types for consistency

## File Guidelines

### When Creating New Components

1. Place in `src/components/` directory
2. Use `.jsx` extension
3. Import React at the top
4. Export as default
5. Follow the existing component structure pattern

### When Modifying Existing Code

- Maintain the existing code style and patterns
- Keep the color scheme consistent
- Don't break existing functionality
- Test changes by running the dev server

## Testing

- Currently, there is no formal test infrastructure
- Manual testing should be done by:
  1. Running `npm run dev`
  2. Verifying the UI loads correctly
  3. Testing node creation (Add Income/Add Expense buttons)
  4. Testing node dragging and connections
  5. Verifying the MiniMap and Controls work

## Dependencies

- When adding new dependencies, use `npm install <package>`
- Keep dependencies minimal and justified
- Check for security vulnerabilities before adding packages
- Prefer well-maintained packages with good documentation

## Git Workflow

- Write clear, descriptive commit messages
- Keep commits focused on a single change or feature
- Don't commit `node_modules/` or build artifacts (already in .gitignore)

## Boundaries and Restrictions

### Never modify:
- Package lock files manually (`package-lock.json`)
- Build artifacts in `dist/` directory
- `.git/` directory

### Always preserve:
- Existing configuration files unless specifically updating them
- The color scheme and visual design language
- ReactFlow integration and core functionality

## Common Tasks

### Adding a new node type:
1. Define the node structure in the component state
2. Assign appropriate `nodeType` in data
3. Apply consistent styling matching the design system
4. Update MiniMap colors if needed

### Modifying node appearance:
1. Update the `style` object in the node definition
2. Keep Tailwind classes in the label component
3. Maintain the existing design patterns

### Adding new features:
1. Keep the existing UI/UX patterns
2. Use Tailwind for styling
3. Maintain ReactFlow best practices
4. Test manually in the dev server
