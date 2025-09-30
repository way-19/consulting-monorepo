# Consulting19 - Project Documentation

## Project Overview
Consulting19 is an AI-powered platform connecting entrepreneurs with expert business advisors across 19+ countries for international business expansion services including company formation, tax optimization, banking solutions, and legal compliance.

## Architecture
This is a **monorepo** with multiple applications:
- **apps/marketing** - Main marketing website (consulting19.com) - **Primary frontend on port 5000**
- **apps/client** - Client dashboard application
- **apps/consultant** - Consultant dashboard application  
- **apps/admin** - Admin dashboard application
- **packages/shared** - Shared components and utilities

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React icons
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase Edge Functions
- **i18n**: react-i18next (EN, TR, PT)
- **Deployment**: Netlify (original), Replit (current)

## Replit Environment Setup

### Current Configuration
- **Port**: 5000 (marketing app)
- **Host**: 0.0.0.0 (configured for Replit proxy)
- **Workflow**: Marketing Site (`npm run dev`)

### Environment Variables Required
Create a `.env` file in the project root with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The application will run with fallback values and mock data if these are not provided, but full functionality requires a Supabase connection.

## Development Commands
```bash
# Start marketing website (default, port 5000)
npm run dev

# Start individual apps
npm run dev:marketing  # Port 5000 (configured for Replit)
npm run dev:client     # Port 5177
npm run dev:consultant # Port 5176
npm run dev:admin      # Port 5174

# Run all apps concurrently
npm run dev:all

# Build for production
npm run build
npm run build:all
```

## Test Accounts
```
Admin:      admin@consulting19.com / Admin123!
Consultant: giorgi.meskhi@consulting19.com / Consultant123!
Client:     client@consulting19.com / Client123!
```

## Database
- **Platform**: Supabase (PostgreSQL)
- **Migrations**: Located in `supabase/migrations/`
- **Edge Functions**: Located in `supabase/functions/`
- **Local Config**: `supabase/config.toml`

## Project Structure
```
consulting19/
├── apps/
│   ├── marketing/    # Main website (port 5000)
│   ├── client/       # Client dashboard
│   ├── consultant/   # Consultant dashboard
│   └── admin/        # Admin dashboard
├── packages/
│   └── shared/       # Shared components and utilities
├── supabase/
│   ├── functions/    # Edge functions
│   └── migrations/   # Database migrations
└── package.json      # Root workspace config
```

## Deployment Status
- **Development**: Running on Replit with marketing app on port 5000
- **Production**: Configured for deployment via Replit

## Recent Changes (Setup on Replit)
- 2025-09-30: Initial Replit setup
  - Configured Vite to run on port 5000 with host 0.0.0.0
  - Added allowed hosts for Replit proxy (.replit.dev, .repl.co)
  - Set up workflow for marketing site
  - Created .env.example for Supabase configuration
  - Application running successfully with fallback/mock data

## Notes
- The marketing app is the primary frontend and is configured to run on port 5000
- Vite HMR (Hot Module Replacement) is working correctly
- Application loads successfully but shows Supabase warnings (expected without env vars)
- All other apps (client, consultant, admin) are on different ports if needed
