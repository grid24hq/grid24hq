# Grid24HQ 🏁

**The Ultimate Racing Hub** — WEC · GT3 · MotoGP · WorldSBK · Endurance

> Live timing · Race data · Circuits · Teams · Live Center

---

## Tech stack

| Onderdeel  | Technologie                        |
|------------|------------------------------------|
| Frontend   | React 18 + Vite + TypeScript       |
| Styling    | Tailwind CSS (custom design tokens)|
| Routing    | React Router v6                    |
| State      | Zustand + React Query (TanStack)   |
| Auth       | Firebase Authentication            |
| Database   | Cloud Firestore                    |
| Email      | Resend (via Cloudflare Worker)     |
| i18n       | i18next (NL + EN)                  |
| Hosting    | Cloudflare Pages                   |
| Repo       | GitHub                             |

---

## Opstarten

```bash
# 1. Clone
git clone https://github.com/grid24hq/grid24hq.git
cd grid24hq

# 2. Installeer dependencies
npm install

# 3. Environment variables instellen
cp .env.example .env
# Vul je Firebase keys in .env (zie Firebase Console)

# 4. Start de dev server
npm run dev
# Open: http://localhost:5173
```

---

## Projectstructuur

```
grid24hq/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── .env.example               ← kopieer naar .env, vul Firebase keys in
│
└── src/
    ├── main.tsx               ← entry point
    ├── App.tsx                ← router + providers
    │
    ├── components/            ← herbruikbare UI componenten
    │   ├── Navbar/
    │   │   ├── Navbar.tsx
    │   │   └── index.ts       ← export { default } from './Navbar'
    │   ├── Footer/
    │   │   ├── Footer.tsx
    │   │   └── index.ts
    │   ├── RaceCard/
    │   │   ├── RaceCard.tsx
    │   │   └── index.ts
    │   ├── DriverCard/
    │   │   ├── DriverCard.tsx
    │   │   └── index.ts
    │   ├── LiveTiming/
    │   │   ├── LiveTiming.tsx
    │   │   └── index.ts
    │   ├── NewsCard/
    │   │   ├── NewsCard.tsx
    │   │   └── index.ts
    │   ├── CircuitMap/
    │   │   ├── CircuitMap.tsx
    │   │   └── index.ts
    │   ├── SeriesBadge/
    │   │   ├── SeriesBadge.tsx
    │   │   └── index.ts
    │   ├── ProtectedRoute/
    │   │   ├── ProtectedRoute.tsx
    │   │   └── index.ts
    │   └── UI/
    │       ├── index.ts
    │       └── LoadingSpinner/
    │           ├── LoadingSpinner.tsx
    │           └── index.ts
    │
    ├── pages/                 ← route-level pagina's
    │   ├── Home/
    │   │   ├── Home.tsx
    │   │   └── index.ts
    │   ├── WEC/
    │   │   ├── WEC.tsx
    │   │   └── index.ts
    │   ├── MotoGP/
    │   │   ├── MotoGP.tsx
    │   │   └── index.ts
    │   ├── GT3/
    │   │   ├── GT3.tsx
    │   │   └── index.ts
    │   ├── IMSA/
    │   │   ├── IMSA.tsx
    │   │   └── index.ts
    │   ├── WorldSBK/
    │   │   ├── WorldSBK.tsx
    │   │   └── index.ts
    │   ├── LiveCenter/        ← 🔒 login vereist
    │   │   ├── LiveCenter.tsx
    │   │   └── index.ts
    │   ├── Circuits/
    │   │   ├── Circuits.tsx
    │   │   └── index.ts
    │   ├── Teams/
    │   │   ├── Teams.tsx
    │   │   └── index.ts
    │   └── Auth/
    │       ├── Login.tsx
    │       ├── Register.tsx
    │       └── index.ts       ← export Login + Register
    │
    ├── layouts/               ← gedeelde page wrappers
    │   ├── MainLayout.tsx     ← navbar + footer
    │   └── AuthLayout.tsx     ← login/register (geen navbar)
    │
    ├── services/              ← externe API communicatie
    │   ├── firebase.ts        ← auth + firestore
    │   ├── raceApi.ts         ← race events, timing, standings
    │   ├── weatherApi.ts      ← Open-Meteo (gratis, geen key)
    │   ├── authService.ts     ← Firebase errors → NL berichten
    │   └── resend.ts          ← email via Cloudflare Worker
    │
    ├── store/                 ← Zustand global state
    │   ├── authStore.ts       ← ingelogde user
    │   └── langStore.ts       ← NL/EN taalinstelling
    │
    ├── hooks/                 ← React hooks
    │   ├── useAuth.ts         ← Firebase auth state
    │   ├── useRace.ts         ← React Query race data
    │   └── useLive.ts         ← live sessie + countdown
    │
    ├── types/
    │   └── index.ts           ← alle TypeScript interfaces
    │
    ├── lib/
    │   └── utils.ts           ← formatLapTime, countryToFlag, etc.
    │
    ├── i18n/
    │   ├── index.ts           ← i18next setup
    │   └── locales/
    │       ├── nl.json        ← Nederlandse vertalingen
    │       └── en.json        ← English translations
    │
    ├── assets/
    │   ├── images/
    │   └── icons/
    │
    └── styles/
        └── globals.css        ← Tailwind + design tokens
```

---

## De index.ts regel

Elke componentmap heeft een `index.ts` met één regel:

```ts
// src/components/Navbar/index.ts
export { default } from './Navbar'
```

Daardoor kun je overal in het project schrijven:
```ts
import Navbar from '@/components/Navbar'      // ✅ schoon
// in plaats van:
import Navbar from '@/components/Navbar/Navbar' // ❌ rommelig
```

---

## Firebase instellen

1. Ga naar [Firebase Console](https://console.firebase.google.com)
2. Maak project aan: `grid24hq`
3. Voeg een Web App toe → kopieer de config
4. Activeer: **Authentication → Email/Password + Google**
5. Activeer: **Firestore Database**
6. Vul de waarden in `.env`

---

## Cloudflare Pages deploy

```bash
npm run build   # output → dist/
```

In Cloudflare Pages dashboard:
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: voeg alle `VITE_*` keys toe

Push naar GitHub → Cloudflare deployt automatisch.

---

## Kleurpalet (design tokens)

| Token           | Waarde    | Gebruik              |
|-----------------|-----------|----------------------|
| `brand-black`   | `#0a0a0a` | Achtergrond          |
| `brand-dark`    | `#111111` | Kaarten, secties     |
| `brand-card`    | `#161616` | Card achtergrond     |
| `brand-border`  | `#222222` | Borders              |
| `brand-red`     | `#e63300` | Live dot, buttons    |
| `brand-orange`  | `#ff6600` | Accenten, links      |
| `brand-amber`   | `#ffaa00` | P1 positie           |
| `brand-muted`   | `#888888` | Subtekst             |

---

## Roadmap

- [x] Projectstructuur (modulair)
- [x] Firebase auth (email + Google)
- [x] NL/EN taalwisseling
- [x] Protected routes (Live Center)
- [x] TypeScript types voor alle data
- [ ] WEC live timing API koppeling
- [ ] Circuit detail pagina's
- [ ] Rijder/team profielen
- [ ] Race kalender volledig
- [ ] Community & forums
- [ ] Fantasy league
- [ ] Mobile app
