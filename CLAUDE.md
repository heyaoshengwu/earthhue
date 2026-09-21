# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EarthHue (earthhue.net) is a B2B website for natural pigments used in food and cosmetics industries. Serves customers in EU, US, Japan, Korea, China, and Southeast Asia with regulatory compliance information.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 with custom earth-tone theme
- **i18n**: next-intl with 7 locales (EN, ZH, JA, KO, ES, FR, DE)
- **Deployment**: Vercel

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
```

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routing (always prefix)
│   │   ├── layout.tsx    # Locale layout with NextIntlClientProvider
│   │   ├── page.tsx      # Home page
│   │   ├── about/
│   │   ├── admin/        # Content management (password protected)
│   │   ├── pigments/     # Pigment database & filter
│   │   ├── products/    # Product catalog
│   │   ├── regulations/ # Regional regulatory info
│   │   └── contact/
│   ├── globals.css       # Tailwind + custom theme
│   └── layout.tsx        # Root layout (pass-through)
├── components/
│   ├── Header.tsx        # Navigation + language switcher
│   ├── Footer.tsx
│   └── PigmentFilter.tsx # Client-side pigment filtering
├── content/
│   ├── pigments/data.ts   # Pigment database (20+ pigments)
│   └── regulations/data.ts # Regulatory standards
├── i18n/
│   ├── routing.ts        # next-intl routing config (localePrefix: "always")
│   └── request.ts        # Server request config
├── messages/             # Translation files
│   ├── en.json, zh.json, ja.json, ko.json, es.json, fr.json, de.json
└── middleware.ts        # Locale detection
```

### Key Patterns

- **i18n**: Use `getTranslations()` in Server Components, `useTranslations()` in Client Components
- **Styling**: Earth-tone palette via CSS custom properties (`--color-earth-*`, `--color-sage-*`, `--color-terracotta-*`)
- **Admin**: Data stored in localStorage, persists across sessions

## Admin Panel

Access at `/[locale]/admin` (e.g., `/en/admin`, `/zh/admin`):

- **Password**: `earthhue2024` (change in `src/app/[locale]/admin/page.tsx`)
- Session-based authentication (persists until browser closes)
- Manage pigments and products via UI
- Changes persist in browser localStorage
- Default data loaded if no localStorage data exists

## URL Structure

- `/en` → English homepage
- `/zh` → Chinese homepage
- `/ja` → Japanese homepage
- All `/[locale]` routes require locale prefix

## Adding Content

### New Pigment (via Admin UI)
Navigate to `/en/admin`, login, select "Pigments" tab, click "Add New Pigment"

### New Product (via Admin UI)
Navigate to `/en/admin`, login, select "Products" tab, click "Add New Product"

### Manually (code)
Add to `src/content/pigments/data.ts` or `src/app/[locale]/products/page.tsx`
