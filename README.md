# Grid24HQ 🏁

**The Ultimate Racing Hub** — F1 · WEC · GT3 · MotoGP · WorldSBK · IMSA · Endurance

> Live timing · Race data · Circuits · Teams · Kalender · Standen · Live Center

---

## Tech stack

| Onderdeel  | Technologie                        |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + TypeScript        |
| Styling    | Tailwind CSS (custom design tokens) |
| Routing    | React Router v6                     |
| State      | Zustand + React Query (TanStack)    |
| Auth       | Firebase Authentication             |
| Database   | Cloud Firestore + Realtime Database |
| Email      | Resend (via Cloudflare Worker)      |
| i18n       | i18next (NL + EN)                   |
| Hosting    | Cloudflare Pages                    |
| Repo       | GitHub                              |

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

## Hoe de live timing werkt

Grid24HQ zelf haalt geen data live op bij de bron — dat gebeurt via een losse tool,
de **Command Center**, die lokaal draait (niet in deze repo, niet gehost).

```
Timing-site (bron)  →  Command Center (lokaal, localhost:5000)  →  Firebase  →  Grid24HQ website
```

- De Command Center (Python/Flask) grabt en formatteert live timing data per raceserie
  (F1, MotoGP, Moto2/3, WEC/ELMS, IMSA, WorldSBK) en pusht die naar Firebase Realtime Database.
- Een aparte **API Sniffer** (localhost:5005) wordt gebruikt om nieuwe timing-endpoints van
  timing-sites te ontdekken, zodat er nieuwe formatters/grabbers gebouwd kunnen worden.
- De website (`useLive` / `useRace` hooks, `raceApi.ts`) pollt Firebase en toont de live tab
  zodra een sessie op "LIVE" staat, anders de kampioenschapsstanden.
- Beide tools draaien alleen lokaal op de PC van de beheerder — geen publieke API, geen
  deployment nodig voor die kant van de pipeline.

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
    │   ├── F1/
    │   │   ├── F1.tsx
    │   │   └── index.ts
    │   ├── WEC/                ← WEC + ELMS + Le Mans Cup
    │   │   ├── WEC.tsx
    │   │   ├── ELMS.tsx
    │   │   ├── LeMansCup.tsx
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
    │   ├── Kalender/           ← racekalender alle series
    │   │   ├── Kalender.tsx
    │   │   └── index.ts
    │   ├── Standen/            ← kampioenschapsstanden
    │   │   └── Standen.tsx
    │   ├── LiveCenter/         ← 🔒 login vereist
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
    │   ├── raceApi.ts         ← race events, live timing, standings (Firebase RTDB)
    │   ├── kalenderApi.ts     ← racekalender data
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
2. Maak project aan: `Jou project`
3. Voeg een Web App toe → kopieer de config
4. Activeer: **Authentication → Email/Password + Google**
5. Activeer: **Firestore Database**
6. Activeer: **Realtime Database** (voor live timing data uit de Command Center)
7. Vul de waarden in `.env`

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
|-----------------|-----------|-----------------------|
| `brand-black`   | `#0a0a0a` | Achtergrond           |
| `brand-dark`    | `#111111` | Kaarten, secties      |
| `brand-card`    | `#161616` | Card achtergrond      |
| `brand-border`  | `#222222` | Borders               |
| `brand-red`     | `#e63300` | Live dot, buttons     |
| `brand-orange`  | `#ff6600` | Accenten, links       |
| `brand-amber`   | `#ffaa00` | P1 positie            |
| `brand-muted`   | `#888888` | Subtekst              |

---

## Roadmap

- [x] Projectstructuur (modulair)
- [x] Firebase auth (email + Google)
- [x] NL/EN taalwisseling
- [x] Protected routes (Live Center)
- [x] TypeScript types voor alle data
- [x] Live timing pipeline (Command Center → Firebase) voor F1, MotoGP, Moto2/3, WEC/ELMS, IMSA, WorldSBK
- [x] Racekalender pagina
- [x] Kampioenschapsstanden pagina
- [ ] Circuit detail pagina's
- [ ] Rijder/team profielen
- [ ] Community & forums
- [ ] Fantasy league
- [ ] Mobile app
