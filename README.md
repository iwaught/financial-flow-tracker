# Financial Flow Tracker

An interactive financial flow tracking application that helps you visualize money flows between income sources, expenses, and your central financial status. Now with user accounts, cloud sync, achievements, and optional pro features!

## Features

### Core Features
- **Interactive Flow Diagram**: Drag and drop nodes to visualize your financial flows
- **Dynamic Node Creation**: Add income and expense nodes on the fly
- **Visual Connections**: Connect nodes to show relationships between different financial elements
- **Color-Coded Nodes**: 
  - Green nodes for income sources
  - Red nodes for expenses
  - Blue central node for financial status
- **Interactive Controls**: Zoom, pan, and fit view to navigate your financial landscape
- **Real-time Updates**: See your financial structure update as you make changes
- **PDF Import**: Import password-protected credit card statements to auto-create expense nodes
  - Extracts payment amounts from PDF text
  - Supports multiple languages (English, Spanish)
  - Converts foreign currencies to USD using daily spot rates
  - Handles password-protected PDFs securely in the browser

### New Features (US-FFT-014 to US-FFT-016)

#### 🔐 User Authentication & Cloud Sync
- **Secure Login**: Email/password authentication with Supabase
- **Multi-Device Access**: Access your flows from any device
- **Automatic Cloud Save**: Your flows are automatically saved to the cloud
- **Data Privacy**: Row-level security ensures you can only access your own data

#### 🏆 Gamification & Achievements
- **Achievement System**: Unlock achievements as you build your financial flow
- **Visual Celebrations**: Confetti effects and toast notifications when unlocking achievements
- **Progress Tracking**: See your progress toward unlocking achievements
- **Starter Achievements**:
  - 💰 **First Step**: Create your first income box
  - 🎯 **Triple Income**: Reach 3 income sources
  - 💳 **Budget Builder**: Create your first expense box
  - ⚖️ **Balanced Map**: Reach 2+ income and 2+ expense boxes
  - 🔗 **Connector**: Create 5 valid connections
  - 💾 **Data Keeper**: Save your flow for the first time

#### 💎 Pro Plan (Optional)
- **Feature Flag**: Billing can be disabled by default
- **Free Plan**: Up to 5 income/expense boxes, full feature access
- **Pro Plan**: $0.99/month for unlimited boxes
- **Stripe Integration**: Secure payment processing
- **Easy Upgrade**: One-click upgrade to Pro plan

## Tech Stack

- **React** 18.2.0 - UI framework
- **Vite** 5.0.8 - Fast development build tool
- **React Flow** 11.10.4 - Interactive flow diagrams with drag & drop
- **Tailwind CSS** 3.4.0 - Utility-first CSS framework
- **Supabase** - Backend (Auth + Postgres + RLS)
- **Stripe** - Payment processing (optional)
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

3. Set up environment variables (see [Setup Guide](docs/US-FFT-014-SETUP-GUIDE.md)):
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
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

### Getting Started

1. **Sign Up/Login**: Create an account or sign in to access your flows
2. **Create Your Flow**: 
   - Click "Add Income" or "Add Expense" buttons to create nodes
   - Drag nodes to position them
   - Click and drag from one node's edge to another to create connections
3. **Edit Values**: 
   - Double-click a node's value to edit it
   - Double-click a node's label to rename it
4. **Save & Sync**: Click "💾 Save" to save your flow to the cloud
5. **Track Progress**: Click "🏆 Achievements" to see your unlocked achievements
6. **Navigate**: Use the controls in the bottom-right to zoom, pan, or fit all nodes in view
7. **Mini Map**: Use the mini map in the bottom-left corner for quick navigation

### Advanced Features

#### PDF Import
Use the "📄 Import PDF" panel to import payment data from credit card statements:
- Select a PDF file (password-protected PDFs supported)
- Enter the PDF password if required
- The app extracts payment amounts, converts to USD, and creates/updates an expense node

**PDF Import Notes:**
- **Supported formats**: Text-based PDFs (not scanned images)
- **Password protection**: Fully supported with clear error messages
- **Languages**: Recognizes payment keywords in English and Spanish
- **Currency conversion**: Uses Frankfurter API for daily spot rates
- **Limitations**: 
  - Extracts up to 2 payment amounts per import
  - Requires text-based PDFs (OCR not supported)
  - Requires internet connection for currency conversion

#### Achievements
Track your progress with 6 starter achievements:
- Create income and expense boxes
- Build balanced financial flows
- Make connections between nodes
- Save your flow data

#### Pro Plan (Optional)
If billing is enabled:
- **Free Plan**: Up to 5 income/expense boxes
- **Pro Plan**: $0.99/month for unlimited boxes
- Click "⭐ Upgrade" to access Pro features

## Setup Guides

For detailed setup instructions, see:
- **[US-FFT-014: Backend Foundation Setup](docs/US-FFT-014-SETUP-GUIDE.md)** - Supabase auth and database
- **[US-FFT-016: Stripe Billing Setup](docs/US-FFT-016-SETUP-GUIDE.md)** - Payment integration (optional)

## Project Structure

```
financial-flow-tracker/
├── docs/
│   ├── US-FFT-014-SETUP-GUIDE.md    # Backend setup guide
│   ├── US-FFT-016-SETUP-GUIDE.md    # Billing setup guide
│   ├── user-stories-and-tests.md    # User stories with acceptance criteria
│   ├── user-stories-tracker.csv     # Excel-compatible tracker
│   └── workflow-guide.md            # Development workflow guide
├── src/
│   ├── components/
│   │   ├── FlowCanvas.jsx           # Main flow diagram component
│   │   ├── Auth.jsx                 # Authentication UI
│   │   ├── AchievementToast.jsx     # Achievement notifications
│   │   ├── AchievementsPanel.jsx    # Achievements list
│   │   └── UpgradeModal.jsx         # Upgrade to Pro modal
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── lib/
│   │   ├── supabase.js              # Supabase client
│   │   ├── flowPersistence.js       # Flow save/load utilities
│   │   ├── achievements.js          # Achievement tracking
│   │   ├── stripe.js                # Stripe configuration
│   │   └── subscription.js          # Subscription utilities
│   ├── App.jsx                       # Root application component
│   ├── main.jsx                      # Application entry point
│   └── index.css                     # Global styles with Tailwind
├── supabase/
│   ├── migrations/                   # Database migrations
│   └── functions/                    # Edge functions for webhooks
├── index.html                        # HTML entry point
├── package.json                      # Project dependencies
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── postcss.config.js                 # PostCSS configuration
```

## Development Workflow

This project follows a story-driven development approach with user stories US-FFT-001 through US-FFT-010.

### Documentation
- **[User Stories & Test Cases](docs/user-stories-and-tests.md)** - Detailed user stories with acceptance criteria
- **[Workflow Guide](docs/workflow-guide.md)** - Step-by-step development workflow for implementing stories
- **[Tracker](docs/user-stories-tracker.csv)** - Excel-compatible tracker for planning and execution

### Quick Start for Contributors
1. Review the [workflow guide](docs/workflow-guide.md)
2. Pick a user story from the [tracker](docs/user-stories-tracker.csv)
3. Create a feature branch following the naming convention
4. Implement the story following acceptance criteria
5. Submit a PR with proper formatting

For detailed instructions, see [docs/workflow-guide.md](docs/workflow-guide.md).

## Contributing

We welcome contributions! Please follow our development workflow:

1. Check [docs/user-stories-tracker.csv](docs/user-stories-tracker.csv) for available stories
2. Follow the workflow in [docs/workflow-guide.md](docs/workflow-guide.md)
3. Submit issues for bugs or feature requests
4. Follow the PR checklist when submitting pull requests

## License

MIT
