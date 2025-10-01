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

## Recent Changes
- 2025-10-01: **Production-Ready Migration Complete**
  - ✅ Migrated from Supabase to Replit PostgreSQL with custom JWT authentication
  - ✅ Built secure backend API infrastructure (Auth: 3001, API: 3002)
  - ✅ Implemented production-grade security:
    * JWT-based authentication with token validation
    * Rate limiting (15 req/15min for sensitive endpoints)
    * Input validation with express-validator
    * CORS restricted to allowed origins
    * Role-based access control (RBAC)
    * SQL injection prevention
  - ✅ Migrated frontend pages to secure APIs:
    * ConsultantDocuments.tsx → /api/documents, /api/clients
    * ClientMessages.tsx → /api/messages, /api/users (polling instead of real-time)
  - ✅ Created authenticated API endpoints:
    * /api/documents (list, upload, status update, delete)
    * /api/messages (send, receive, mark read, conversations)
    * /api/clients (list with RBAC, get by ID)
    * /api/users (get profile with relationship checks)
  - ✅ Updated all Vite proxies to route /api/* to backend servers
  - ✅ Exported createAuthenticatedFetch helper from shared package

- 2025-09-30: Initial Replit setup
  - Configured Vite to run on port 5000 with host 0.0.0.0
  - Added allowed hosts for Replit proxy (.replit.dev, .repl.co)
  - Set up workflow for marketing site
  - Created .env.example for Supabase configuration

## Backend Architecture
### Auth Server (Port 3001)
- Handles authentication: login, logout, register, refresh tokens
- JWT token generation and validation
- Rate limiting: 5 attempts/15min for auth endpoints

### API Server (Port 3002)
- RESTful API for all business logic
- JWT middleware protection on all routes
- Rate limiting: 15 requests/15min for sensitive operations
- Input validation with express-validator
- Endpoints:
  * `/api/documents` - Document management
  * `/api/messages` - Messaging system
  * `/api/clients` - Client management
  * `/api/users` - User profiles

## Notes
- **Security**: All API endpoints protected with JWT authentication and RBAC
- **Frontend**: Uses `createAuthenticatedFetch()` for API calls with automatic token handling
- **Database**: Replit PostgreSQL with parameterized queries (SQL injection prevention)
- **Migration Status**: ConsultantDocuments and ClientMessages fully migrated from Supabase
- **Real-time**: Messages use polling (5-second interval) instead of WebSocket subscriptions
- Vite HMR (Hot Module Replacement) is working correctly
- All apps (marketing: 5000, consultant: 3000, client: 5173) are running with proper proxy configuration
