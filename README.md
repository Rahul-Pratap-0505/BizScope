
# BizScope

**Modern Business Analytics Dashboard**

BizScope is a next-generation business intelligence dashboard providing instant insight into your company's Key Performance Indicators (KPIs). Powered by a secure backend, Supabase authentication, AI analytics, and a fully responsive UI, BizScope is designed for fast-growing teams and founders who want real-time understanding of their business metrics.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Screenshots & Demo](#screenshots--demo)
- [API & Database](#api--database)
- [Security & Performance](#security--performance)
- [Roadmap / Future Enhancements](#roadmap--future-enhancements)
- [Contact](#contact)

---

## Project Overview

BizScope aims to deliver actionable business analytics through a sleek, user-friendly dashboard. Users can securely track KPIs, visualize trends, set up alert rules, and ask questions using a built-in AI assistant powered by OpenAI.

---

## Features

- **User Authentication:** Secure email/password login and registration (Supabase Auth).
- **KPI Dashboard:** At-a-glance KPI cards with trending indicators (deltas, subtitles).
- **Data Visualization:** Interactive charts for time-series and per-metric trends (Recharts).
- **Alert Rules:** Set threshold-based alerts for any KPI.
- **Provider Integration:** Ready to connect to data sources like Stripe.
- **AI Analytics Assistant:** Ask natural language questions about your business data and get instant answers.
- **Email Reports:** Instantly email KPI summaries to yourself.
- **Mobile Responsive Design:** Optimized for desktop and mobile.
- **Dark Mode Support:** Toggle for light/dark themes.

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **UI & Styling:** Tailwind CSS, shadcn/ui component library, Lucide Icons
- **Backend/Database:** Supabase (PostgreSQL, Auth, Edge Functions, RLS)
- **API & Serverless:** Supabase Edge Functions (for AI chat and emailing)
- **Charts & Visualization:** Recharts
- **State & Data:** Tanstack React Query
- **Dev Tools:** Eslint, Prettier

---

## Architecture

- **Monorepo Structure:** Clear separation of frontend, hooks, components, integrations, and database migrations.
- **Supabase Integration:** All data flows through Supabase, enabling secure RLS for user data.
- **Session Management:** Robust authentication and session protection at both route and UI component level.
- **Modular UI:** All major dashboard elements are reusable components.
- **API Layer:** Supabase Edge Functions for AI assistant and emailing reports.

```
App.tsx
 ├── /pages
 │     ├── Index (Dashboard)
 │     ├── Auth (Login/Signup)
 │     ├── Analytics (Charts, Reports)
 │     ├── AnalyticsChat (AI Assistant)
 │     └── DataManagement (Manage KPIs)
 ├── /components
 │     ├── layout (Header, Sidebar, etc)
 │     ├── dashboard (KPI cards, Alerts)
 │     ├── data (Charts, Tables)
 │     └── ui (Inputs, Buttons, etc)
 └── /hooks
       └── useKpis, useKpiChartData, useCurrentEmail, etc.
```

---

## Getting Started

### Prerequisites

- **Node.js** (18+ recommended)
- **npm** (or yarn/pnpm)
- **Supabase account** (with configured project, database, and credentials)

### Clone & Install

```sh
git clone <YOUR_REPO_URL>
cd <YOUR_PROJECT_DIRECTORY>
npm install
```

### Environment Configuration

You must set these environment variables in your build platform or local setup (see your deployment host's docs):

- `VITE_SUPABASE_URL` - Your Supabase project API URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous public key

> Do NOT commit keys or secrets to source control.  
> For emailing and AI functions, configure the required secrets (`RESEND_API_KEY`, `OPENAI_API_KEY`, etc.) in your Supabase project.

### Start Development Server

```sh
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage Guide

### 1. **Authentication**

- Register a new account or login using your email and password.
- Authentication is enforced on all routes except `/auth`.

### 2. **Dashboard (Homepage)**

- View overview KPI cards at the top: revenue, customer count, conversion rate, etc.
- See instantaneous indicators and deltas.

### 3. **Analytics Page**

- Visualize KPI trends with interactive line charts.
- Drill down into per-metric bar graphs.
- Instantly export or email KPI summaries.

### 4. **AI Analytics Chat**

- Access the AI chat via the sidebar or navigation.
- Ask questions in plain English (e.g. “Show me the last 3 months of revenue.”)
- Get intelligent business insight from your data.

### 5. **Data Management & Alerts**

- Add/edit/remove KPI metrics and chart points.
- Set up custom alert rules for any KPI threshold.

### 6. **Integration**

- Integrate with additional data providers (e.g. Stripe) to fetch real business data.

---

## Screenshots & Demo

> _Consider adding screenshots or animated GIFs here to showcase your UI, charts, and AI chat!_

---

## API & Database

### Database Schema

- **kpi_metrics:** Stores current values and display info for each KPI.
- **kpi_chart_points:** Holds time-series data for each KPI (e.g., monthly revenue).
- **profiles:** Maps users to public profile/username.
- **alert_rules:** User-defined alert thresholds for any KPI.

### Supabase Edge Functions

- **analytics-chat** – AI-powered metric insights, invoked via /analytics-chat
- **email-metrics** – Securely send KPI reports to user’s email

**All endpoints are protected and scoped to the authenticated user (RLS).**

---

## Security & Performance

- **Row Level Security (RLS):** Enforced on all user data.
- **Secure Auth:** Sessions managed and persisted via Supabase.
- **Modern Component Design:** Optimized, modular React components.
- **Efficient Rendering:** Only fetches and renders required data using React Query and Suspense.

---

## Roadmap / Future Enhancements

- OAuth options (Google, Microsoft login)
- Multi-tenant & team support
- More provider integrations (QuickBooks, Shopify, custom APIs)
- Advanced alerting (Slack/Teams/Email)
- Custom AI analytics pipelines
- Dashboard customization & theming
- Comprehensive automated test suite

---

## Contact

**Project Lead:** Rahul Pratap  
**Demo:** _Available on request_  
**Questions/Feedback:** Please open an issue or reach out via email.

---

