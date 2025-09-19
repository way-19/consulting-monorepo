# Consulting19 - AI-Powered Global Business Consulting

## 🌟 **Project Overview**

Consulting19 is an AI-powered platform connecting entrepreneurs with expert business advisors across 19+ countries for international business expansion services including company formation, tax optimization, banking solutions, and legal compliance.

## 🏗️ **Current Structure**

```
consulting19/
├── apps/
│   └── marketing/     # Main marketing website (consulting19.com)
├── supabase/         # Database & Edge Functions
├── netlify.toml      # Deployment configuration
└── package.json      # Root package configuration
```

## 🚀 **Development Commands**

```bash
# Start marketing website (Port 5173)
npm run dev

# Build for production
npm run build
```

## 🌍 **Features**

- **AI Oracle Assistant**: Smart jurisdiction recommendations
- **Expert Network**: Local specialists in 19+ countries  
- **Comprehensive Services**: Company formation, tax optimization, banking, legal compliance
- **Multi-language Support**: EN, TR, PT with i18next
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔐 **Test Accounts**

```
Admin:     admin@consulting19.com / Admin123!
Consultant: giorgi.meskhi@consulting19.com / Consultant123!
Client:    client@consulting19.com / Client123!
```

## 🗄️ **Database Status**

Database will be rebuilt from scratch with proper schema and RLS policies.

## 🎨 **Tech Stack**

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React icons
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify
- **i18n**: react-i18next

## 📁 **Key Files**

- `apps/marketing/src/App.tsx` - Main application router
- `apps/marketing/src/pages/HomePage.tsx` - Landing page
- `supabase/functions/` - Edge functions for backend logic
- `netlify.toml` - Deployment configuration

---

**Status**: Ready for fresh database setup and dashboard rebuild