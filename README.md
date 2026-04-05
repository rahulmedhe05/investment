# Wealthora — Investment Growth Simulation Dashboard

A full-featured investment simulation dashboard built with Next.js 14, Firebase, Recharts, and Framer Motion.

> ⚠️ **Disclaimer**: Wealthora is a simulation platform only. No real money is involved. All returns are simulated using compound interest formulas and do not represent actual investment returns.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Firebase** (Authentication + Firestore)
- **Recharts** (Growth charts)
- **Framer Motion** (Animations)
- **React Hot Toast** (Notifications)

## Features

- 🔐 Firebase Authentication (Email/Password)
- 📊 Real-time compound growth simulation
- 📈 Interactive growth charts with Recharts
- 💼 Two investment plans (Growth Starter & Wealth Accelerator)
- 🔒 Lock-in period tracking with progress bars
- 📋 Transaction history table
- 🛡️ Admin panel for managing simulations
- 🎨 Dark glassmorphism UI with Framer Motion animations
- 📱 Fully responsive

## Investment Plans

| Plan | Amount | Annual Rate | Lock Period |
|------|--------|-------------|-------------|
| Growth Starter | ₹50,000 | 18% p.a. | 3 months |
| Wealth Accelerator | ₹1,00,000 | 21% p.a. | 6 months |

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd investment
npm install
```

### 2. Configure Firebase

Copy `.env.local.example` to `.env.local` and fill in your Firebase project credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── login/page.tsx      # Authentication page
│   ├── dashboard/page.tsx  # User dashboard
│   └── admin/page.tsx      # Admin panel
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── PlanCard.tsx        # Investment plan card
│   ├── GrowthChart.tsx     # Recharts area chart
│   └── DashboardCard.tsx   # Stats card with animation
└── lib/
    ├── firebase.ts         # Firebase configuration
    ├── authContext.tsx     # Auth context provider
    └── calculateGrowth.ts  # Growth calculation utilities
```

## Demo Mode

The app works without Firebase configured — it falls back to demo data so you can preview the UI.

## Pages

- `/` — Landing page with hero, plan cards, and growth chart preview
- `/login` — Sign in / Sign up
- `/dashboard` — User investment dashboard
- `/admin` — Admin panel (all investments overview)
