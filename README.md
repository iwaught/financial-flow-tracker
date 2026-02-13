# Financial Flow Tracker

An interactive financial flow tracking application that helps you visualize money flows between income sources, expenses, and your central financial status.

## Features

- **Interactive Flow Diagram**: Drag and drop nodes to visualize your financial flows
- **Dynamic Node Creation**: Add income and expense nodes on the fly
- **Visual Connections**: Connect nodes to show relationships between different financial elements
- **Color-Coded Nodes**: 
  - Green nodes for income sources
  - Red nodes for expenses
  - Blue central node for financial status
- **Interactive Controls**: Zoom, pan, and fit view to navigate your financial landscape
- **Real-time Updates**: See your financial structure update as you make changes

## Tech Stack

- **React** - UI framework
- **Vite** - Fast development build tool
- **React Flow** - Interactive flow diagrams with drag & drop
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - Core programming language

## Installation

1. Clone the repository:
```bash
git clone https://github.com/iwaught/financial-flow-tracker.git
cd financial-flow-tracker
```

2. Install dependencies:
```bash
npm install
```

## Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. **Drag Nodes**: Click and drag any node to reposition it on the canvas
2. **Create Connections**: Click and drag from the edge of one node to another to create a connection
3. **Add Income**: Click the "Add Income" button to create a new income source node
4. **Add Expense**: Click the "Add Expense" button to create a new expense node
5. **Navigate**: Use the controls in the bottom-right to zoom, pan, or fit all nodes in view
6. **Mini Map**: Use the mini map in the bottom-left corner for quick navigation

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

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
