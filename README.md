# GangOfMusafirs — Website

Next.js 16 full-stack travel booking platform. See the [root README](../README.md) for full documentation.

## Quick Start

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local   # then fill in your keys
npm run dev                        # http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Key Directories

```
app/           → Pages & API routes (App Router)
components/    → Reusable UI components (12 components)
lib/           → Database, auth, payments, rate limiting
lib/models/    → Mongoose schemas (Package, Booking, Inquiry, BlogPost)
public/        → Static assets
```

## Routes (31 total)

**Static pages:** `/`, `/packages`, `/book`, `/contact`, `/my-bookings`, `/login`, `/admin/*`
**Dynamic pages:** `/packages/[slug]`, `/blog`, `/blog/[slug]`
**API endpoints:** `/api/packages`, `/api/inquiry`, `/api/bookings/*`, `/api/blog/*`, `/api/auth/*`

## Environment Variables

See [root README](../README.md#2-configure-environment-variables) for the full `.env.local` template.
