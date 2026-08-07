# SME VIETNAM 2026 — Premium Landing Page

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Production_Ready-black)](https://vercel.com/)

Official high-converting single-page web application for **DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026**.

- **Date:** 18–20 September 2026
- **Location:** May Plaza Hotel, Thai Nguyen City, Vietnam
- **Organizer:** Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên (TASME)

---

## 🌟 Key Features

- 🎯 **Full Width Hero Section:** High-resolution single backdrop imagery with dark overlay, glassmorphism badge, event metadata, 1.450.000 VNĐ price tag, and direct action CTAs.
- 📊 **Animated Statistics Counters:** Interactive numbers showing 100+ B2B Matches, 03 Event Days, 02 Gala Dinners, and Thousands of Business Opportunities.
- 🏢 **About & Strategic Value:** Comprehensive overview of forum goals, target audience, and 20+ years of TASME organizer credentials.
- 💎 **6 Value Proposition Cards:** Highlighting B2B Matching, Government Dialogues, Investment Promotion, Networking, SME Community, and Media Exposure.
- 📅 **Interactive 3-Day Program:** Timeline tab switcher for Day 1 (Opening & Forum), Day 2 (B2B Matching & Gala Dinner), and Day 3 (Factory Visit & Closing).
- 🎟️ **Highlighted Registration Fee Card:** 1.450.000 VNĐ per delegate listing all 7 inclusive perks (2 hotel nights, meals, gala dinners, standee, media coverage, event pass).
- 🏆 **Sponsorship Packages Grid:** Diamond, Gold, Silver, and Bronze tier packages with PDF proposal download trigger.
- 🏬 **Booth Exhibition Section:** Specs, pricing, and an interactive modal preview of May Plaza Hotel exhibition floor plan.
- ✍️ **Validated Registration Form:** Built with React Hook Form + Zod validation schema, posting to Google Apps Script (with local `/api/register` proxy fallback).
- 🎉 **Digital Ticket Receipt & Confetti:** Instant confetti explosion, toast confirmation, and electronic QR ticket summary.
- 🗺️ **Interactive Footer:** Complete organizer details, social channels, and embedded Google Maps iframe for May Plaza Hotel.
- 🚀 **SEO & Schema Markup:** Next.js Metadata API, Open Graph, Twitter Cards, `sitemap.ts`, `robots.ts`, and JSON-LD `BusinessEvent` structured data.

---

## 🎨 Branding & Color Palette

- **Primary:** `#0B5ED7` (Vibrant Corporate Blue)
- **Secondary:** `#1D3557` (Deep Navy)
- **Accent:** `#F4B400` (Warm Gold)
- **Background:** `#F8FAFC` (Light Slate)
- **Border:** `#E5E7EB`
- **Typography:** `Wix Madefor Display` & `Wix Madefor Text` (Fallback: `Inter`, sans-serif)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19 + Lucide Icons + Canvas Confetti
- **Styling:** Tailwind CSS v4 + Custom Glassmorphism Utilities
- **Animations:** Framer Motion
- **Form & Validation:** React Hook Form + Zod
- **Backend Storage & Email:** Google Apps Script + Google Sheets

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📄 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) — Step-by-step deployment guide for Vercel and Google Apps Script.
- [google-apps-script.js](google-apps-script.js) — Production Google Apps Script backend code.
- [.env.example](.env.example) — Environment variable documentation.
