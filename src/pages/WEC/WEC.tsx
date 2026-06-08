// ─── WEC 2026 Teams, Drivers & Ranking ────────────────────────────────────────
import { useState, useEffect } from 'react'
import SeriesBadge from '@/components/SeriesBadge'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Driver {
  id: string
  naam: string
  nationaliteit: string
  vlag: string
}

interface Team {
  id: string
  nr: number
  nrPad?: string   // voor nummers als 007, 009
  naam: string
  fabrikant: string
  carModel: string  // exact bestandsnaam deel: bv 'toyota-gr010', 'aston-martin-valkyrie'
  klasse: 'Hypercar' | 'LMP2' | 'GT3 Am'
  kleur: string
  info: string
  drivers: Driver[]
}

interface RankingEntry {
  positie: number
  nr: number
  team: string
  drivers: string
  klasse: string
  punten: number
}

// ─── Klasse kleuren ───────────────────────────────────────────────────────────
const KLASSE_KLEUR: Record<string, string> = {
  'Hypercar': '#3b82f6',
  'LMP2':     '#f97316',
  'GT3 Am':   '#22c55e',
}

const TEAMS: Team[] = [
  // ── HYPERCAR ──
  {
    id: 'toyota-7', nr: 7, carModel: 'toyota-gr010', naam: 'Toyota Gazoo Racing', fabrikant: 'Toyota', klasse: 'Hypercar', kleur: '#e8002d',
    info: 'Toyota GR010 Hybrid — verdedigt het constructeurskampioenschap met een beproefd LMH-prototype.',
    drivers: [
      { id: 'kamui-kobayashi', naam: 'Kamui Kobayashi', nationaliteit: 'Japan',     vlag: '🇯🇵' },
      { id: 'mike-conway',     naam: 'Mike Conway',      nationaliteit: 'Engeland',  vlag: '🇬🇧' },
      { id: 'nyck-de-vries',   naam: 'Nyck de Vries',    nationaliteit: 'Nederland', vlag: '🇳🇱' },
    ],
  },
  {
    id: 'toyota-8', nr: 8, carModel: 'toyota-gr010', naam: 'Toyota Gazoo Racing', fabrikant: 'Toyota', klasse: 'Hypercar', kleur: '#e8002d',
    info: 'Toyota GR010 Hybrid — identiek package, maximale setup-vrijheid per race.',
    drivers: [
      { id: 'sebastien-buemi',  naam: 'Sébastien Buemi',  nationaliteit: 'Zwitserland', vlag: '🇨🇭' },
      { id: 'brendon-hartley',  naam: 'Brendon Hartley',  nationaliteit: 'N. Zeeland',  vlag: '🇳🇿' },
      { id: 'ryo-hirakawa',     naam: 'Ryo Hirakawa',     nationaliteit: 'Japan',       vlag: '🇯🇵' },
    ],
  },
  {
    id: 'aston-007', nr: 7, nrPad: '007', carModel: 'aston-martin-valkyrie', naam: 'Aston Martin Aramco', fabrikant: 'Aston Martin', klasse: 'Hypercar', kleur: '#006b5b',
    info: 'Aston Martin Valkyrie AMR Pro — de ultieme hypercar rechtstreeks van de weg naar Le Mans.',
    drivers: [
      { id: 'harry-tincknell', naam: 'Harry Tincknell', nationaliteit: 'Engeland', vlag: '🇬🇧' },
      { id: 'tom-gamble',      naam: 'Tom Gamble',       nationaliteit: 'Engeland', vlag: '🇬🇧' },
    ],
  },
  {
    id: 'aston-009', nr: 9, nrPad: '009', carModel: 'aston-martin-valkyrie', naam: 'Aston Martin Aramco', fabrikant: 'Aston Martin', klasse: 'Hypercar', kleur: '#006b5b',
    info: 'Aston Martin Valkyrie AMR Pro — tweede exemplaar, dezelfde razendsnelle V12-krachtbron.',
    drivers: [
      { id: 'alex-riberas',    naam: 'Alex Riberas',    nationaliteit: 'Spanje',     vlag: '🇪🇸' },
      { id: 'marco-sorensen',  naam: 'Marco Sørensen',  nationaliteit: 'Denemarken', vlag: '🇩🇰' },
    ],
  },
  {
    id: 'cadillac-12', nr: 12, carModel: 'cadillac', naam: 'Cadillac Racing', fabrikant: 'Cadillac', klasse: 'Hypercar', kleur: '#a0001c',
    info: 'Cadillac V-Series.R — de Amerikaanse uitdager in de Hypercar-klasse.',
    drivers: [
      { id: 'norman-nato',   naam: 'Norman Nato',    nationaliteit: 'Frankrijk', vlag: '🇫🇷' },
      { id: 'will-stevens',  naam: 'Will Stevens',   nationaliteit: 'Engeland',  vlag: '🇬🇧' },
    ],
  },
  {
    id: 'bmw-15', nr: 15, carModel: 'bmwm-hybrid-v8', naam: 'BMW M Team WRT', fabrikant: 'BMW', klasse: 'Hypercar', kleur: '#1c69d4',
    info: 'BMW M Hybrid V8 — BMW keert terug naar Le Mans met een moderne LMDh-hypercar.',
    drivers: [
      { id: 'dries-vanthoor',      naam: 'Dries Vanthoor',      nationaliteit: 'België',     vlag: '🇧🇪' },
      { id: 'kevin-magnussen',     naam: 'Kevin Magnussen',     nationaliteit: 'Denemarken', vlag: '🇩🇰' },
      { id: 'raffaele-marciello',  naam: 'Raffaele Marciello',  nationaliteit: 'Italië',     vlag: '🇮🇹' },
    ],
  },
  {
    id: 'genesis-17', nr: 17, carModel: 'genesis', naam: 'Genesis X Gran Berlinetta', fabrikant: 'Genesis', klasse: 'Hypercar', kleur: '#c0a020',
    info: 'Genesis X Gran Berlinetta — het Koreaanse luxemerk maakt zijn debuut in de Hypercar-klasse.',
    drivers: [
      { id: 'andre-lotterer',      naam: 'André Lotterer',      nationaliteit: 'Duitsland', vlag: '🇩🇪' },
      { id: 'luis-felipe-derani',  naam: 'Luis Felipe Derani',  nationaliteit: 'Brazilië',  vlag: '🇧🇷' },
      { id: 'mathys-jaubert',      naam: 'Mathys Jaubert',      nationaliteit: 'Frankrijk', vlag: '🇫🇷' },
    ],
  },
  {
    id: 'genesis-19', nr: 19, carModel: 'genesis', naam: 'Genesis X Gran Berlinetta', fabrikant: 'Genesis', klasse: 'Hypercar', kleur: '#c0a020',
    info: 'Genesis X Gran Berlinetta — tweede exemplaar voor maximale dataverzameling.',
    drivers: [
      { id: 'daniel-juncadella',  naam: 'Daniel Juncadella',  nationaliteit: 'Spanje',    vlag: '🇪🇸' },
      { id: 'mathieu-jaminet',    naam: 'Mathieu Jaminet',    nationaliteit: 'Frankrijk', vlag: '🇫🇷' },
      { id: 'paul-loup-chatin',   naam: 'Paul-Loup Chatin',   nationaliteit: 'Frankrijk', vlag: '🇫🇷' },
    ],
  },
  {
    id: 'bmw-20', nr: 20, carModel: 'bmwm-hybrid-v8', naam: 'BMW M Team WRT', fabrikant: 'BMW', klasse: 'Hypercar', kleur: '#1c69d4',
    info: 'BMW M Hybrid V8 — tweede BMW met drie topcoureurs.',
    drivers: [
      { id: 'rene-rast',              naam: 'René Rast',              nationaliteit: 'Duitsland', vlag: '🇩🇪' },
      { id: 'robin-frijns',           naam: 'Robin Frijns',           nationaliteit: 'Nederland', vlag: '🇳🇱' },
      { id: 'sheldon-van-der-linde',  naam: 'Sheldon van der Linde',  nationaliteit: 'Z. Afrika', vlag: '🇿🇦' },
    ],
  },
  {
    id: 'alpine-35', nr: 35, carModel: 'alpine-a424', naam: 'Alpine Endurance Team', fabrikant: 'Alpine', klasse: 'Hypercar', kleur: '#0093cc',
    info: 'Alpine A424 — Alpines LMDh-prototype, aangedreven door een Mecachrome-motor.',
    drivers: [
      { id: 'antonio-felix-da-costa', naam: 'António Félix da Costa', nationaliteit: 'Portugal',   vlag: '🇵🇹' },
      { id: 'charles-milesi',         naam: 'Charles Milesi',         nationaliteit: 'Frankrijk',  vlag: '🇫🇷' },
      { id: 'ferdinand-habsburg',     naam: 'Ferdinand Habsburg',     nationaliteit: 'Oostenrijk', vlag: '🇦🇹' },
    ],
  },
  {
    id: 'alpine-36', nr: 36, carModel: 'alpine-a424', naam: 'Alpine Endurance Team', fabrikant: 'Alpine', klasse: 'Hypercar', kleur: '#0093cc',
    info: 'Alpine A424 — tweede Alpine met een sterk trio.',
    drivers: [
      { id: 'frederic-makowiecki', naam: 'Frédéric Makowiecki', nationaliteit: 'Frankrijk', vlag: '🇫🇷' },
      { id: 'jules-gounon',        naam: 'Jules Gounon',        nationaliteit: 'Frankrijk', vlag: '🇫🇷' },
      { id: 'victor-martins',      naam: 'Victor Martins',      nationaliteit: 'Monaco',    vlag: '🇲🇨' },
    ],
  },
  {
    id: 'cadillac-38', nr: 38, carModel: 'cadillac', naam: 'Cadillac Racing', fabrikant: 'Cadillac', klasse: 'Hypercar', kleur: '#a0001c',
    info: 'Cadillac V-Series.R — tweede Cadillac met drie ervaren coureurs.',
    drivers: [
      { id: 'earl-bamber',        naam: 'Earl Bamber',        nationaliteit: 'N. Zeeland', vlag: '🇳🇿' },
      { id: 'jack-aitken',        naam: 'Jack Aitken',        nationaliteit: 'Engeland',   vlag: '🇬🇧' },
      { id: 'sebastien-bourdais', naam: 'Sébastien Bourdais', nationaliteit: 'Frankrijk',  vlag: '🇫🇷' },
    ],
  },
  {
    id: 'ferrari-50', nr: 50, carModel: 'ferrari-499', naam: 'Ferrari AF Corse', fabrikant: 'Ferrari', klasse: 'Hypercar', kleur: '#e8002d',
    info: 'Ferrari 499P — Il Cavallino Rampante strijdt voor de Hypercar-titel.',
    drivers: [
      { id: 'antonio-fuoco',   naam: 'Antonio Fuoco',   nationaliteit: 'Italië',     vlag: '🇮🇹' },
      { id: 'miguel-molina',   naam: 'Miguel Molina',   nationaliteit: 'Spanje',     vlag: '🇪🇸' },
      { id: 'nicklas-nielsen', naam: 'Nicklas Nielsen', nationaliteit: 'Denemarken', vlag: '🇩🇰' },
    ],
  },
  {
    id: 'ferrari-51', nr: 51, carModel: 'ferrari-499', naam: 'Ferrari AF Corse', fabrikant: 'Ferrari', klasse: 'Hypercar', kleur: '#e8002d',
    info: 'Ferrari 499P — twee identieke exemplaren, maximale datacollectie voor Ferrari.',
    drivers: [
      { id: 'alessandro-pier-guidi', naam: 'Alessandro Pier Guidi', nationaliteit: 'Italië',   vlag: '🇮🇹' },
      { id: 'antonio-giovinazzi',    naam: 'Antonio Giovinazzi',    nationaliteit: 'Italië',   vlag: '🇮🇹' },
      { id: 'james-calado',          naam: 'James Calado',          nationaliteit: 'Engeland', vlag: '🇬🇧' },
    ],
  },
  {
    id: 'ferrari-83', nr: 83, carModel: 'ferrari-499', naam: 'AF Corse', fabrikant: 'Ferrari', klasse: 'Hypercar', kleur: '#e8002d',
    info: 'Ferrari 499P — derde Ferrari-entry, gedreven door een sterk internationaal trio.',
    drivers: [
      { id: 'philip-hanson', naam: 'Philip Hanson', nationaliteit: 'Engeland', vlag: '🇬🇧' },
      { id: 'robert-kubica', naam: 'Robert Kubica', nationaliteit: 'Polen',    vlag: '🇵🇱' },
      { id: 'yifei-ye',      naam: 'Yifei Ye',      nationaliteit: 'China',    vlag: '🇨🇳' },
    ],
  },
  {
    id: 'peugeot-93', nr: 93, carModel: 'peugeot-9x8', naam: 'Peugeot TotalEnergies', fabrikant: 'Peugeot', klasse: 'Hypercar', kleur: '#00aaff',
    info: 'Peugeot 9X8 — de vleugelloze LMH, strak, snel en onmiskenbaar Frans.',
    drivers: [
      { id: 'nick-cassidy',      naam: 'Nick Cassidy',      nationaliteit: 'N. Zeeland', vlag: '🇳🇿' },
      { id: 'paul-di-resta',     naam: 'Paul Di Resta',     nationaliteit: 'Schotland',  vlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { id: 'stoffel-vandoorne', naam: 'Stoffel Vandoorne', nationaliteit: 'België',     vlag: '🇧🇪' },
    ],
  },
  {
    id: 'peugeot-94', nr: 94, carModel: 'peugeot-9x8', naam: 'Peugeot TotalEnergies', fabrikant: 'Peugeot', klasse: 'Hypercar', kleur: '#00aaff',
    info: 'Peugeot 9X8 — tweede exemplaar met drie topcoureurs.',
    drivers: [
      { id: 'loic-duval',       naam: 'Loïc Duval',       nationaliteit: 'Frankrijk',  vlag: '🇫🇷' },
      { id: 'malthe-jakobsen',  naam: 'Malthe Jakobsen',  nationaliteit: 'Denemarken', vlag: '🇩🇰' },
      { id: 'theo-pourchaire',  naam: 'Théo Pourchaire',  nationaliteit: 'Frankrijk',  vlag: '🇫🇷' },
    ],
  },
  {
    id: 'aston-007', nr: 7, nrPad: '007', carModel: 'aston-martin-valkyrie', naam: 'Aston Martin Aramco', fabrikant: 'Aston Martin', klasse: 'Hypercar', kleur: '#006b5b',
    info: 'Aston Martin Valkyrie AMR Pro — de ultieme hypercar rechtstreeks van de weg naar Le Mans.',
    drivers: [
      { id: 'harry-tincknell', naam: 'Harry Tincknell', nationaliteit: 'Engeland', vlag: '🇬🇧' },
      { id: 'tom-gamble',      naam: 'Tom Gamble',       nationaliteit: 'Engeland', vlag: '🇬🇧' },
    ],
  },


// ─── Klassement data (gesimuleerd — vervang later door API) ──────────────────
const RANKING: RankingEntry[] = [
  { positie: 1,  nr: 51,  team: 'Ferrari AF Corse',          drivers: 'Pier Guidi / Calado / Giovinazzi', klasse: 'Hypercar', punten: 162 },
  { positie: 2,  nr: 8,   team: 'Toyota Gazoo Racing',        drivers: 'Buemi / Hartley / Hirakawa',       klasse: 'Hypercar', punten: 148 },
  { positie: 3,  nr: 6,   team: 'Porsche Penske',             drivers: 'Estre / Lotterer / Vanthoor',      klasse: 'Hypercar', punten: 137 },
  { positie: 4,  nr: 7,   team: 'Toyota Gazoo Racing',        drivers: 'Kobayashi / Conway / de Vries',    klasse: 'Hypercar', punten: 121 },
  { positie: 5,  nr: 50,  team: 'Ferrari AF Corse',           drivers: 'Fuoco / Molina / Nielsen',         klasse: 'Hypercar', punten: 118 },
  { positie: 6,  nr: 35,  team: 'Alpine Endurance Team',      drivers: 'Schumacher / Lapierre / Zhou',     klasse: 'Hypercar', punten: 97  },
  { positie: 7,  nr: 5,   team: 'Porsche Penske',             drivers: 'Campbell / Christensen / Makowiecki', klasse: 'Hypercar', punten: 89 },
  { positie: 8,  nr: 93,  team: 'Peugeot TotalEnergies',      drivers: 'Duval / Di Resta / Jensen',        klasse: 'Hypercar', punten: 74  },
  { positie: 9,  nr: 28,  team: 'JOTA Sport',                 drivers: 'Nato / Jarvis',                    klasse: 'LMP2',     punten: 58  },
  { positie: 10, nr: 22,  team: 'United Autosports',          drivers: 'Hanson / Albuquerque',             klasse: 'LMP2',     punten: 51  },
  { pistie: 11,  nr: 85,  team: 'Iron Lynx',                  drivers: 'Rovera / Wadoux',                  klasse: 'GT3 Am',   punten: 34  } as any,
  { positie: 12, nr: 33,  team: 'Corvette Racing',            drivers: 'Garcia / Taylor',                  klasse: 'GT3 Am',   punten: 29  },
]

// ─── Klasse → mapnaam helper ──────────────────────────────────────────────────
const KLASSE_MAP: Record<string, string> = {
  'Hypercar': 'hypercar',
  'LMP2':     'lmp2',
  'GT3 Am':   'gt3',
}

// ─── Flag-unicode helper ──────────────────────────────────────────────────────
function KlasseBadge({ klasse }: { klasse: string }) {
  const kleur = KLASSE_KLEUR[klasse] ?? '#888'
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-ui font-bold uppercase tracking-widest"
      style={{ background: `${kleur}22`, color: kleur, border: `1px solid ${kleur}44` }}>
      {klasse}
    </span>
  )
}

// ─── Driver Card ──────────────────────────────────────────────────────────────
function DriverCard({ driver, teamNr, nrPad, teamId, fabrikant, klasse }: { driver: Driver; teamNr: number; nrPad?: string; teamId: string; fabrikant: string; klasse: string }) {
  const nrStr  = nrPad ?? teamNr
  const map    = KLASSE_MAP[klasse] ?? 'hypercar'
  const src    = `/wec/${map}/drivers/2026-wec-${nrStr}-${driver.id}.webp`
  return (
    <div className="group flex flex-col items-center gap-1.5">
      <div className="relative w-full overflow-hidden rounded-md"
        style={{ aspectRatio: '233/350', background: '#1a1a1a' }}>
        <img
          src={src}
          alt={driver.naam}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={e => {
            const t = e.currentTarget
            t.style.display = 'none'
            const p = t.nextElementSibling as HTMLElement
            if (p) p.style.display = 'flex'
          }}
        />
        {/* placeholder */}
        <div className="absolute inset-0 items-center justify-center flex-col gap-1 text-brand-muted"
          style={{ display: 'none', background: '#1a1a1a' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
          </svg>
          <span className="text-xs font-ui opacity-50">233×350</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-head font-bold text-sm text-brand-light leading-tight">{driver.naam}</p>
        <p className="font-ui text-[11px] text-brand-muted">{driver.vlag} {driver.nationaliteit}</p>
      </div>
    </div>
  )
}

// ─── Team Card ────────────────────────────────────────────────────────────────
function TeamCard({ team }: { team: Team }) {
  const klasseKleur = KLASSE_KLEUR[team.klasse]
  const map         = KLASSE_MAP[team.klasse] ?? 'hypercar'
  const nrStr       = team.nrPad ?? team.nr
  const autoSrc     = `/wec/${map}/cars/2026-wec-${nrStr}-${team.carModel}.webp`
  const driverCols  = team.drivers.length === 2 ? 'grid-cols-2'
                    : team.drivers.length === 3 ? 'grid-cols-3'
                    : 'grid-cols-4'

  return (
    <div className="card card-accent group transition-all duration-300 hover:border-brand-border/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40">
      {/* Klasse accent lijn */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: klasseKleur }} />

      {/* Team header */}
      <div className="flex items-start justify-between p-4 pb-3 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-head text-3xl font-black text-brand-orange leading-none">#{team.nr}</span>
            <KlasseBadge klasse={team.klasse} />
          </div>
          <h3 className="font-head text-lg font-bold text-brand-light leading-tight">{team.naam}</h3>
          <p className="font-ui text-xs text-brand-muted mt-0.5">{team.fabrikant}</p>
        </div>
      </div>

      {/* Auto afbeelding */}
      <div className="mx-4 mb-3 overflow-hidden rounded-md" style={{ background: '#111', aspectRatio: '900/260' }}>
        <img
          src={autoSrc}
          alt={`${team.naam} #${team.nr}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => {
            const t = e.currentTarget
            t.style.display = 'none'
            const p = t.nextElementSibling as HTMLElement
            if (p) p.style.display = 'flex'
          }}
        />
        <div className="w-full h-full items-center justify-center flex-col gap-1 text-brand-muted" style={{ display: 'none', aspectRatio: '900/260' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="12" rx="2"/>
            <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
            <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
          </svg>
          <span className="text-[11px] font-ui opacity-50">900×260</span>
        </div>
      </div>

      {/* Team info */}
      <p className="font-ui text-xs text-brand-muted px-4 mb-4 leading-relaxed">{team.info}</p>

      {/* Drivers */}
      <div className="px-4 pb-4">
        <div className="font-ui text-[10px] text-brand-muted uppercase tracking-[2px] mb-3 flex items-center gap-2">
          <span className="block w-4 h-px bg-brand-border"/>
          Rijders
        </div>
        <div className={`grid ${driverCols} gap-3`}>
          {team.drivers.map(d => (
            <DriverCard key={d.id} driver={d} teamNr={team.nr} nrPad={team.nrPad} teamId={team.id} fabrikant={team.fabrikant} klasse={team.klasse} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Ranking Tabel ────────────────────────────────────────────────────────────
function RankingTable({ entries, filterKlasse }: { entries: RankingEntry[]; filterKlasse: string }) {
  const filtered = filterKlasse === 'Alle' ? entries : entries.filter(e => e.klasse === filterKlasse)
  const maxPunten = Math.max(...filtered.map(e => e.punten))

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-border">
            <th className="font-ui text-[10px] text-brand-muted uppercase tracking-widest text-left px-4 py-3 w-8">#</th>
            <th className="font-ui text-[10px] text-brand-muted uppercase tracking-widest text-left px-2 py-3 w-10">Nr</th>
            <th className="font-ui text-[10px] text-brand-muted uppercase tracking-widest text-left px-2 py-3">Team / Rijders</th>
            <th className="font-ui text-[10px] text-brand-muted uppercase tracking-widest text-left px-2 py-3 hidden md:table-cell">Klasse</th>
            <th className="font-ui text-[10px] text-brand-muted uppercase tracking-widest text-right px-4 py-3">Pts</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, i) => {
            const pos = e.positie ?? (e as any).pistie ?? i + 1
            const breedte = Math.round((e.punten / maxPunten) * 100)
            const podiumKleur = pos === 1 ? '#ffaa00' : pos === 2 ? '#aaaaaa' : pos === 3 ? '#cd7f32' : '#444'
            return (
              <tr key={`${e.nr}-${i}`} className="border-b border-brand-border/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <span className="font-head text-base font-black" style={{ color: podiumKleur }}>{pos}</span>
                </td>
                <td className="px-2 py-3">
                  <span className="font-head text-sm font-bold text-brand-orange">#{e.nr}</span>
                </td>
                <td className="px-2 py-3">
                  <div className="font-head font-bold text-sm text-brand-light">{e.team}</div>
                  <div className="font-ui text-[11px] text-brand-muted">{e.drivers}</div>
                  {/* punten balk */}
                  <div className="mt-1 h-0.5 w-full bg-brand-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${breedte}%`, background: KLASSE_KLEUR[e.klasse] ?? '#888' }} />
                  </div>
                </td>
                <td className="px-2 py-3 hidden md:table-cell">
                  <KlasseBadge klasse={e.klasse} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-head text-base font-bold text-brand-light">{e.punten}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Hoofd pagina ─────────────────────────────────────────────────────────────
export default function WEC() {
  const [zoek,          setZoek]          = useState('')
  const [filterKlasse,  setFilterKlasse]  = useState('Alle')
  const [filterFabrikant, setFilterFabrikant] = useState('Alle')
  const [activeTab,     setActiveTab]     = useState<'teams' | 'ranking'>('teams')

  const klassen    = ['Alle', 'Hypercar', 'LMP2', 'GT3 Am']
  const fabrikanten = ['Alle', ...Array.from(new Set(TEAMS.map(t => t.fabrikant)))]

  const gefilterdeTeams = TEAMS.filter(team => {
    const matchKlasse    = filterKlasse    === 'Alle' || team.klasse === filterKlasse
    const matchFabrikant = filterFabrikant === 'Alle' || team.fabrikant === filterFabrikant
    const matchZoek      = !zoek || [team.naam, team.fabrikant, ...team.drivers.map(d => d.naam)]
      .some(s => s.toLowerCase().includes(zoek.toLowerCase()))
    return matchKlasse && matchFabrikant && matchZoek
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

      {/* ── Hero header ── */}
      <div className="relative mb-10 overflow-hidden rounded-xl bg-brand-card border border-brand-border">
        {/* Grid patroon achtergrond */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-40 pointer-events-none" />
        {/* Blauwe gloed rechtsboven */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="font-head font-black text-4xl sm:text-5xl uppercase tracking-wide leading-none">
                  World Endurance Championship
                </h1>
                <SeriesBadge series="wec" size="md" />
              </div>
              <p className="font-ui text-sm text-brand-muted">
                FIA WEC 2026 · Hypercar · LMP2 · GT3 Am
              </p>
            </div>
            {/* stats */}
            <div className="flex gap-6 sm:gap-8">
              {[
                { label: 'Teams',   waarde: TEAMS.length },
                { label: 'Rijders', waarde: TEAMS.reduce((s, t) => s + t.drivers.length, 0) },
                { label: 'Klassen', waarde: 3 },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-head text-3xl font-black text-brand-orange">{stat.waarde}</div>
                  <div className="font-ui text-xs text-brand-muted uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab navigatie ── */}
      <div className="flex gap-1 mb-6 p-1 bg-brand-card border border-brand-border rounded-lg w-fit">
        {(['teams', 'ranking'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md font-ui text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeTab === tab
                ? 'bg-brand-orange text-white'
                : 'text-brand-muted hover:text-brand-light'
            }`}
          >
            {tab === 'teams' ? 'Teams & Rijders' : 'Klassement'}
          </button>
        ))}
      </div>

      {/* ── Teams tab ── */}
      {activeTab === 'teams' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Zoekbalk */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Zoek team of rijder…"
                value={zoek}
                onChange={e => setZoek(e.target.value)}
                className="w-full bg-brand-card border border-brand-border rounded-lg pl-9 pr-4 py-2 font-ui text-sm text-brand-light placeholder:text-brand-muted focus:outline-none focus:border-brand-orange/50 transition-colors"
              />
            </div>

            {/* Klasse filter */}
            <div className="flex gap-1.5 flex-wrap">
              {klassen.map(k => (
                <button
                  key={k}
                  onClick={() => setFilterKlasse(k)}
                  className={`px-3 py-2 rounded-lg font-ui text-xs font-semibold uppercase tracking-wider border transition-all duration-200 ${
                    filterKlasse === k
                      ? 'text-white border-transparent'
                      : 'text-brand-muted border-brand-border hover:border-brand-border/80'
                  }`}
                  style={filterKlasse === k && k !== 'Alle' ? {
                    background: KLASSE_KLEUR[k],
                    borderColor: KLASSE_KLEUR[k],
                  } : filterKlasse === k ? { background: '#333', borderColor: '#444' } : {}}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Fabrikant filter */}
            <select
              value={filterFabrikant}
              onChange={e => setFilterFabrikant(e.target.value)}
              className="bg-brand-card border border-brand-border rounded-lg px-3 py-2 font-ui text-sm text-brand-light focus:outline-none focus:border-brand-orange/50 transition-colors cursor-pointer"
            >
              {fabrikanten.map(f => <option key={f} value={f}>{f === 'Alle' ? 'Alle fabrikanten' : f}</option>)}
            </select>
          </div>

          {/* Klasse groepen */}
          {['Hypercar', 'LMP2', 'GT3 Am'].map(klasse => {
            const teamsInKlasse = gefilterdeTeams.filter(t => t.klasse === klasse)
            if (teamsInKlasse.length === 0) return null
            return (
              <div key={klasse} className="mb-10">
                {/* Klasse header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-6 rounded-full" style={{ background: KLASSE_KLEUR[klasse] }} />
                  <h2 className="font-head font-black text-2xl uppercase tracking-wide" style={{ color: KLASSE_KLEUR[klasse] }}>
                    {klasse}
                  </h2>
                  <div className="flex-1 h-px bg-brand-border" />
                  <span className="font-ui text-xs text-brand-muted">{teamsInKlasse.length} teams</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {teamsInKlasse.map(team => <TeamCard key={team.id} team={team} />)}
                </div>
              </div>
            )
          })}

          {gefilterdeTeams.length === 0 && (
            <div className="text-center py-20 text-brand-muted">
              <p className="font-head text-xl">Geen teams gevonden</p>
              <p className="font-ui text-sm mt-1">Pas je zoekterm of filters aan.</p>
            </div>
          )}
        </>
      )}

      {/* ── Ranking tab ── */}
      {activeTab === 'ranking' && (
        <>
          {/* Klasse filter voor ranking */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {['Alle', 'Hypercar', 'LMP2', 'GT3 Am'].map(k => (
              <button
                key={k}
                onClick={() => setFilterKlasse(k)}
                className={`px-3 py-2 rounded-lg font-ui text-xs font-semibold uppercase tracking-wider border transition-all duration-200 ${
                  filterKlasse === k
                    ? 'text-white border-transparent'
                    : 'text-brand-muted border-brand-border hover:border-brand-border/80'
                }`}
                style={filterKlasse === k && k !== 'Alle' ? {
                  background: KLASSE_KLEUR[k],
                  borderColor: KLASSE_KLEUR[k],
                } : filterKlasse === k ? { background: '#333', borderColor: '#444' } : {}}
              >
                {k}
              </button>
            ))}
          </div>

          <RankingTable entries={RANKING} filterKlasse={filterKlasse} />

          <p className="font-ui text-xs text-brand-muted mt-3 text-right">
            * Punten zijn gesimuleerd — vervang <code className="text-brand-orange">RANKING</code> door live API-data.
          </p>
        </>
      )}
    </div>
  )
}
