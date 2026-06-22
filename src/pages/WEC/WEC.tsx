// ─── WEC 2026 — Compact overzicht + Modal detail ──────────────────────────────
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
  nrPad?: string
  naam: string
  fabrikant: string
  carModel: string
  klasse: 'Hypercar' | 'GT3 (LMGT3)'
  kleur: string
  info: string
  drivers: Driver[]
}

// ─── Kleuren ──────────────────────────────────────────────────────────────────
const KLASSE_KLEUR: Record<string, string> = {
  'Hypercar':    '#3b82f6',
  'GT3 (LMGT3)': '#22c55e',
}
const KLASSE_MAP: Record<string, string> = {
  'Hypercar':    'hypercar',
  'GT3 (LMGT3)': 'gt3',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TEAMS: Team[] = [
  { id: 'toyota-7',    nr: 7,   carModel: 'toyota-gr010',         naam: 'Toyota Gazoo Racing',       fabrikant: 'Toyota',       klasse: 'Hypercar', kleur: '#e8002d', info: 'Toyota GR010 Hybrid — verdedigt het constructeurskampioenschap met een beproefd LMH-prototype.',
    drivers: [{ id: 'kamui-kobayashi', naam: 'Kamui Kobayashi', nationaliteit: 'Japan',       vlag: '🇯🇵' }, { id: 'mike-conway', naam: 'Mike Conway', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'nyck-de-vries', naam: 'Nyck de Vries', nationaliteit: 'Nederland', vlag: '🇳🇱' }] },
  { id: 'toyota-8',    nr: 8,   carModel: 'toyota-gr010',         naam: 'Toyota Gazoo Racing',       fabrikant: 'Toyota',       klasse: 'Hypercar', kleur: '#e8002d', info: 'Toyota GR010 Hybrid — identiek package, maximale setup-vrijheid per race.',
    drivers: [{ id: 'sebastien-buemi', naam: 'Sébastien Buemi', nationaliteit: 'Zwitserland', vlag: '🇨🇭' }, { id: 'brendon-hartley', naam: 'Brendon Hartley', nationaliteit: 'N. Zeeland', vlag: '🇳🇿' }, { id: 'ryo-hirakawa', naam: 'Ryo Hirakawa', nationaliteit: 'Japan', vlag: '🇯🇵' }] },
  { id: 'aston-007',   nr: 7,   nrPad: '007', carModel: 'aston-martin-valkyrie', naam: 'Aston Martin Aramco', fabrikant: 'Aston Martin', klasse: 'Hypercar', kleur: '#006b5b', info: 'Aston Martin Valkyrie AMR Pro — de ultieme hypercar rechtstreeks van de weg naar Le Mans.',
    drivers: [{ id: 'harry-tincknell', naam: 'Harry Tincknell', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'tom-gamble', naam: 'Tom Gamble', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'aston-009',   nr: 9,   nrPad: '009', carModel: 'aston-martin-valkyrie', naam: 'Aston Martin Aramco', fabrikant: 'Aston Martin', klasse: 'Hypercar', kleur: '#006b5b', info: 'Aston Martin Valkyrie AMR Pro — tweede exemplaar, dezelfde razendsnelle V12-krachtbron.',
    drivers: [{ id: 'alex-riberas', naam: 'Alex Riberas', nationaliteit: 'Spanje', vlag: '🇪🇸' }, { id: 'marco-sorensen', naam: 'Marco Sørensen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }] },
  { id: 'cadillac-12', nr: 12,  carModel: 'cadillac',             naam: 'Cadillac Racing',            fabrikant: 'Cadillac',     klasse: 'Hypercar', kleur: '#a0001c', info: 'Cadillac V-Series.R — de Amerikaanse uitdager in de Hypercar-klasse.',
    drivers: [{ id: 'norman-nato', naam: 'Norman Nato', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'will-stevens', naam: 'Will Stevens', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'bmw-15',      nr: 15,  carModel: 'bmwm-hybrid-v8',       naam: 'BMW M Team WRT',             fabrikant: 'BMW',          klasse: 'Hypercar', kleur: '#1c69d4', info: 'BMW M Hybrid V8 — BMW keert terug naar Le Mans met een moderne LMDh-hypercar.',
    drivers: [{ id: 'dries-vanthoor', naam: 'Dries Vanthoor', nationaliteit: 'België', vlag: '🇧🇪' }, { id: 'kevin-magnussen', naam: 'Kevin Magnussen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }, { id: 'raffaele-marciello', naam: 'Raffaele Marciello', nationaliteit: 'Italië', vlag: '🇮🇹' }] },
  { id: 'genesis-17',  nr: 17,  carModel: 'genesis',              naam: 'Genesis X Gran Berlinetta',  fabrikant: 'Genesis',      klasse: 'Hypercar', kleur: '#c0a020', info: 'Genesis X Gran Berlinetta — het Koreaanse luxemerk maakt zijn debuut in de Hypercar-klasse.',
    drivers: [{ id: 'andre-lotterer', naam: 'André Lotterer', nationaliteit: 'Duitsland', vlag: '🇩🇪' }, { id: 'luis-felipe-derani', naam: 'Luis Felipe Derani', nationaliteit: 'Brazilië', vlag: '🇧🇷' }, { id: 'mathys-jaubert', naam: 'Mathys Jaubert', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },
  { id: 'genesis-19',  nr: 19,  carModel: 'genesis',              naam: 'Genesis X Gran Berlinetta',  fabrikant: 'Genesis',      klasse: 'Hypercar', kleur: '#c0a020', info: 'Genesis X Gran Berlinetta — tweede exemplaar voor maximale dataverzameling.',
    drivers: [{ id: 'daniel-juncadella', naam: 'Daniel Juncadella', nationaliteit: 'Spanje', vlag: '🇪🇸' }, { id: 'mathieu-jaminet', naam: 'Mathieu Jaminet', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'paul-loup-chatin', naam: 'Paul-Loup Chatin', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },
  { id: 'bmw-20',      nr: 20,  carModel: 'bmwm-hybrid-v8',       naam: 'BMW M Team WRT',             fabrikant: 'BMW',          klasse: 'Hypercar', kleur: '#1c69d4', info: 'BMW M Hybrid V8 — tweede BMW met drie topcoureurs.',
    drivers: [{ id: 'rene-rast', naam: 'René Rast', nationaliteit: 'Duitsland', vlag: '🇩🇪' }, { id: 'robin-frijns', naam: 'Robin Frijns', nationaliteit: 'Nederland', vlag: '🇳🇱' }, { id: 'sheldon-van-der-linde', naam: 'Sheldon van der Linde', nationaliteit: 'Z. Afrika', vlag: '🇿🇦' }] },
  { id: 'alpine-35',   nr: 35,  carModel: 'alpine-a424',          naam: 'Alpine Endurance Team',      fabrikant: 'Alpine',       klasse: 'Hypercar', kleur: '#0093cc', info: 'Alpine A424 — Alpines LMDh-prototype, aangedreven door een Mecachrome-motor.',
    drivers: [{ id: 'antonio-felix-da-costa', naam: 'António Félix da Costa', nationaliteit: 'Portugal', vlag: '🇵🇹' }, { id: 'charles-milesi', naam: 'Charles Milesi', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'ferdinand-habsburg', naam: 'Ferdinand Habsburg', nationaliteit: 'Oostenrijk', vlag: '🇦🇹' }] },
  { id: 'alpine-36',   nr: 36,  carModel: 'alpine-a424',          naam: 'Alpine Endurance Team',      fabrikant: 'Alpine',       klasse: 'Hypercar', kleur: '#0093cc', info: 'Alpine A424 — tweede Alpine met een sterk trio.',
    drivers: [{ id: 'frederic-makowiecki', naam: 'Frédéric Makowiecki', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'jules-gounon', naam: 'Jules Gounon', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'victor-martins', naam: 'Victor Martins', nationaliteit: 'Monaco', vlag: '🇲🇨' }] },
  { id: 'cadillac-38', nr: 38,  carModel: 'cadillac',             naam: 'Cadillac Racing',            fabrikant: 'Cadillac',     klasse: 'Hypercar', kleur: '#a0001c', info: 'Cadillac V-Series.R — tweede Cadillac met drie ervaren coureurs.',
    drivers: [{ id: 'earl-bamber', naam: 'Earl Bamber', nationaliteit: 'N. Zeeland', vlag: '🇳🇿' }, { id: 'jack-aitken', naam: 'Jack Aitken', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'sebastien-bourdais', naam: 'Sébastien Bourdais', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },
  { id: 'ferrari-50',  nr: 50,  carModel: 'ferrari-499',          naam: 'Ferrari AF Corse',           fabrikant: 'Ferrari',      klasse: 'Hypercar', kleur: '#e8002d', info: 'Ferrari 499P — Il Cavallino Rampante strijdt voor de Hypercar-titel.',
    drivers: [{ id: 'antonio-fuoco', naam: 'Antonio Fuoco', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'miguel-molina', naam: 'Miguel Molina', nationaliteit: 'Spanje', vlag: '🇪🇸' }, { id: 'nicklas-nielsen', naam: 'Nicklas Nielsen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }] },
  { id: 'ferrari-51',  nr: 51,  carModel: 'ferrari-499',          naam: 'Ferrari AF Corse',           fabrikant: 'Ferrari',      klasse: 'Hypercar', kleur: '#e8002d', info: 'Ferrari 499P — twee identieke exemplaren, maximale datacollectie voor Ferrari.',
    drivers: [{ id: 'alessandro-pier-guidi', naam: 'Alessandro Pier Guidi', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'antonio-giovinazzi', naam: 'Antonio Giovinazzi', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'james-calado', naam: 'James Calado', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'ferrari-83',  nr: 83,  carModel: 'ferrari-499',          naam: 'AF Corse',                   fabrikant: 'Ferrari',      klasse: 'Hypercar', kleur: '#e8002d', info: 'Ferrari 499P — derde Ferrari-entry, gedreven door een sterk internationaal trio.',
    drivers: [{ id: 'philip-hanson', naam: 'Philip Hanson', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'robert-kubica', naam: 'Robert Kubica', nationaliteit: 'Polen', vlag: '🇵🇱' }, { id: 'yifei-ye', naam: 'Yifei Ye', nationaliteit: 'China', vlag: '🇨🇳' }] },
  { id: 'peugeot-93',  nr: 93,  carModel: 'peugeot-9x8',         naam: 'Peugeot TotalEnergies',      fabrikant: 'Peugeot',      klasse: 'Hypercar', kleur: '#00aaff', info: 'Peugeot 9X8 — de vleugelloze LMH, strak, snel en onmiskenbaar Frans.',
    drivers: [{ id: 'nick-cassidy', naam: 'Nick Cassidy', nationaliteit: 'N. Zeeland', vlag: '🇳🇿' }, { id: 'paul-di-resta', naam: 'Paul Di Resta', nationaliteit: 'Schotland', vlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }, { id: 'stoffel-vandoorne', naam: 'Stoffel Vandoorne', nationaliteit: 'België', vlag: '🇧🇪' }] },
  { id: 'peugeot-94',  nr: 94,  carModel: 'peugeot-9x8',         naam: 'Peugeot TotalEnergies',      fabrikant: 'Peugeot',      klasse: 'Hypercar', kleur: '#00aaff', info: 'Peugeot 9X8 — tweede exemplaar met drie topcoureurs.',
    drivers: [{ id: 'loic-duval', naam: 'Loïc Duval', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'malthe-jakobsen', naam: 'Malthe Jakobsen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }, { id: 'theo-pourchaire', naam: 'Théo Pourchaire', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },

  // ── GT3 (LMGT3) ──
  { id: 'ferrari-21',  nr: 21,  carModel: 'ferrari-296-gt3',     naam: 'Iron Lynx',                  fabrikant: 'Ferrari',      klasse: 'GT3 (LMGT3)', kleur: '#e8002d', info: 'Ferrari 296 GT3 — Iron Lynx in de LMGT3-klasse.',
    drivers: [{ id: 'alessio-rovera', naam: 'Alessio Rovera', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'francois-heriau', naam: 'François Heriau', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'simon-mann', naam: 'Simon Mann', nationaliteit: 'VS', vlag: '🇺🇸' }] },
  { id: 'corvette-33', nr: 33,  carModel: 'corvette-z06-gt3',    naam: 'Corvette Racing',            fabrikant: 'Corvette',     klasse: 'GT3 (LMGT3)', kleur: '#ffcc00', info: 'Corvette Z06 GT3.R — de Amerikaanse sportwagen in LMGT3.',
    drivers: [{ id: 'ben-keating', naam: 'Ben Keating', nationaliteit: 'VS', vlag: '🇺🇸' }, { id: 'jonny-edgar', naam: 'Jonny Edgar', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'nicky-catsburg', naam: 'Nicky Catsburg', nationaliteit: 'Nederland', vlag: '🇳🇱' }] },
  { id: 'ferrari-54',  nr: 54,  carModel: 'ferrari-296-gt3',     naam: 'Vista AF Corse',             fabrikant: 'Ferrari',      klasse: 'GT3 (LMGT3)', kleur: '#e8002d', info: 'Ferrari 296 GT3 — Vista AF Corse met drie ervaren coureurs.',
    drivers: [{ id: 'davide-rigon', naam: 'Davide Rigon', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'francesco-castellacci', naam: 'Francesco Castellacci', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'thomas-flohr', naam: 'Thomas Flohr', nationaliteit: 'Zwitserland', vlag: '🇨🇭' }] },
  { id: 'mclaren-58',  nr: 58,  carModel: 'mclaren-720s',        naam: 'United Autosports',          fabrikant: 'McLaren',      klasse: 'GT3 (LMGT3)', kleur: '#ff8000', info: 'McLaren 720S GT3 Evo — United Autosports in LMGT3.',
    drivers: [{ id: 'alexander-west', naam: 'Alexander West', nationaliteit: 'Zweden', vlag: '🇸🇪' }, { id: 'benjamin-goethe', naam: 'Benjamin Goethe', nationaliteit: 'Duitsland', vlag: '🇩🇪' }, { id: 'finn-gehrsitz', naam: 'Finn Gehrsitz', nationaliteit: 'Duitsland', vlag: '🇩🇪' }] },
  { id: 'mercedes-61', nr: 61,  carModel: 'mercedes',            naam: 'Akkodis ASP',                fabrikant: 'Mercedes',     klasse: 'GT3 (LMGT3)', kleur: '#00d2be', info: 'Mercedes-AMG GT3 — Akkodis ASP in de LMGT3-klasse.',
    drivers: [{ id: 'martin-berry', naam: 'Martin Berry', nationaliteit: 'Australië', vlag: '🇦🇺' }, { id: 'maxime-martin', naam: 'Maxime Martin', nationaliteit: 'België', vlag: '🇧🇪' }, { id: 'rui-andrade', naam: 'Rui Andrade', nationaliteit: 'Portugal', vlag: '🇵🇹' }] },
  { id: 'ford-77',     nr: 77,  carModel: 'ford-mustang',        naam: 'Proton Competition',         fabrikant: 'Ford',         klasse: 'GT3 (LMGT3)', kleur: '#003e99', info: 'Ford Mustang GT3 — Proton Competition met Ford power.',
    drivers: [{ id: 'ben-tuck', naam: 'Ben Tuck', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'eric-powell', naam: 'Eric Powell', nationaliteit: 'VS', vlag: '🇺🇸' }, { id: 'sebastian-priaulx', naam: 'Sebastian Priaulx', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'lexus-87',    nr: 87,  carModel: 'lexus-rc-f-lmgt3',   naam: 'TOYOTA Gazoo Racing',        fabrikant: 'Lexus',        klasse: 'GT3 (LMGT3)', kleur: '#e8002d', info: 'Lexus RC F LMGT3 — Gazoo Racing in de GT3-klasse.',
    drivers: [{ id: 'clemens-schmid', naam: 'Clemens Schmid', nationaliteit: 'Oostenrijk', vlag: '🇦🇹' }, { id: 'jose-maria-lopez', naam: 'José María López', nationaliteit: 'Argentinië', vlag: '🇦🇷' }, { id: 'petru-umbrarescu', naam: 'Petru Umbrarescu', nationaliteit: 'Roemenië', vlag: '🇷🇴' }] },
  { id: 'ford-88',     nr: 88,  carModel: 'ford-mustang',        naam: 'Proton Competition',         fabrikant: 'Ford',         klasse: 'GT3 (LMGT3)', kleur: '#003e99', info: 'Ford Mustang GT3 — tweede Ford entry van Proton Competition.',
    drivers: [{ id: 'giammarco-levorato', naam: 'Giammarco Levorato', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'logan-sargeant', naam: 'Logan Sargeant', nationaliteit: 'VS', vlag: '🇺🇸' }, { id: 'stefano-gattuso', naam: 'Stefano Gattuso', nationaliteit: 'Italië', vlag: '🇮🇹' }] },
  { id: 'porsche-91',  nr: 91,  carModel: 'porsche-911-gt3',     naam: 'Porsche GT3 Cup',            fabrikant: 'Porsche',      klasse: 'GT3 (LMGT3)', kleur: '#c0a060', info: 'Porsche 911 GT3 R — klassiek Porsche GT3-programma.',
    drivers: [{ id: 'ayhancan-guven', naam: 'Ayhancan Güven', nationaliteit: 'Turkije', vlag: '🇹🇷' }, { id: 'james-cottingham', naam: 'James Cottingham', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'porsche-92',  nr: 92,  carModel: 'porsche-911-gt3',     naam: 'Porsche GT3 Cup',            fabrikant: 'Porsche',      klasse: 'GT3 (LMGT3)', kleur: '#c0a060', info: 'Porsche 911 GT3 R — tweede Porsche met internationaal trio.',
    drivers: [{ id: 'riccardo-pera', naam: 'Riccardo Pera', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'richard-lietz', naam: 'Richard Lietz', nationaliteit: 'Oostenrijk', vlag: '🇦🇹' }, { id: 'yasser-shahin', naam: 'Yasser Shahin', nationaliteit: 'Australië', vlag: '🇦🇺' }] },
]

// ─── Vlag afbeelding helper (640×480 → 20×15) ────────────────────────────────
const VLAG_CODES: Record<string, string> = {
  '🇯🇵': 'jp', '🇬🇧': 'gb', '🇳🇱': 'nl', '🇨🇭': 'ch', '🇳🇿': 'nz', '🇪🇸': 'es',
  '🇩🇰': 'dk', '🇧🇪': 'be', '🇩🇪': 'de', '🇫🇷': 'fr', '🇮🇹': 'it', '🇵🇹': 'pt',
  '🇦🇹': 'at', '🇲🇨': 'mc', '🇧🇷': 'br', '🇺🇸': 'us', '🇵🇱': 'pl', '🇨🇳': 'cn',
  '🇿🇦': 'za', '🇦🇺': 'au', '🇸🇪': 'se', '🇹🇷': 'tr', '🇷🇴': 'ro', '🇦🇷': 'ar',
  '🏴󠁧󠁢󠁳󠁣󠁴󠁿': 'gb',
}
function VlagImg({ emoji, size = 20 }: { emoji: string; size?: number }) {
  const code = VLAG_CODES[emoji]
  if (!code) return <span style={{ fontSize: size * 0.7 }}>{emoji}</span>
  return (
    <img
      src={`/wec/flags/${code}.webp`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      className="inline-block object-cover rounded-sm flex-shrink-0"
      style={{ imageRendering: 'crisp-edges' }}
      onError={e => {
        const el = e.currentTarget
        el.style.display = 'none'
        const span = document.createElement('span')
        span.textContent = emoji
        el.parentNode?.insertBefore(span, el.nextSibling)
      }}
    />
  )
}
function nrStr(team: Team) { return team.nrPad ?? String(team.nr) }
function carSrc(team: Team) {
  const map = KLASSE_MAP[team.klasse] ?? 'hypercar'
  return `/wec/${map}/cars/2026-wec-${nrStr(team)}-${team.carModel}.webp`
}
function driverSrc(team: Team, driver: Driver) {
  const map = KLASSE_MAP[team.klasse] ?? 'hypercar'
  return `/wec/${map}/drivers/2026-wec-${nrStr(team)}-${driver.id}.webp`
}

function KlasseBadge({ klasse }: { klasse: string }) {
  const c = KLASSE_KLEUR[klasse] ?? '#888'
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-ui font-bold uppercase tracking-widest"
      style={{ background: `${c}22`, color: c, border: `1px solid ${c}44` }}>
      {klasse}
    </span>
  )
}

// ─── Team Rij (compact overzicht) ─────────────────────────────────────────────
function TeamRij({ team, onClick }: { team: Team; onClick: () => void }) {
  const klasseKleur = KLASSE_KLEUR[team.klasse] ?? '#888'
  return (
    <button
      onClick={onClick}
      className="w-full text-left group flex items-center hover:bg-white/[0.03] transition-colors border-b border-brand-border/40 last:border-0 cursor-pointer min-h-[88px]"
    >
      {/* Kleur accent */}
      <div className="w-0.5 self-stretch flex-shrink-0" style={{ background: klasseKleur }} />

      {/* Nr — vaste breedte */}
      <div className="w-24 flex-shrink-0 flex items-center justify-center">
        <span className="font-head text-2xl font-black text-brand-orange">#{nrStr(team)}</span>
      </div>

      {/* Auto — vaste breedte, mooi gecentreerd */}
      <div className="w-56 flex-shrink-0 px-3 hidden sm:block">
        <div className="overflow-hidden rounded-md flex items-center justify-center" style={{ background: '#0d0d0d', height: '72px' }}>
          <img
            src={carSrc(team)}
            alt={team.carModel}
            className="w-full h-full object-contain p-1"
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.15' }}
          />
        </div>
      </div>

      {/* Team naam + fabrikant — vaste breedte */}
      <div className="w-72 flex-shrink-0 px-4">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-head font-bold text-base text-brand-light group-hover:text-white transition-colors">{team.naam}</span>
          <KlasseBadge klasse={team.klasse} />
        </div>
        <span className="font-ui text-xs text-brand-muted">{team.fabrikant}</span>
      </div>

      {/* Rijders — vult rest van de ruimte, gelijkmatig */}
      <div className="flex-1 flex items-center gap-6 px-4 hidden md:flex">
        {team.drivers.map(d => (
          <span key={d.id} className="font-ui text-sm text-brand-muted whitespace-nowrap flex items-center gap-1.5">
            <VlagImg emoji={d.vlag} size={18} /> {d.naam}
          </span>
        ))}
      </div>

      {/* Pijl */}
      <div className="px-5 text-brand-muted group-hover:text-brand-orange transition-colors flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </div>
    </button>
  )
}

// ─── Premium Team Popup (F1/MotoGP stijl) ─────────────────────────────────────
function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const kleur = KLASSE_KLEUR[team.klasse] ?? '#888'
  const [tab, setTab] = useState<'overzicht' | 'rijders' | 'auto'>('overzicht')

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const tabs: { id: 'overzicht' | 'rijders' | 'auto'; label: string }[] = [
    { id: 'overzicht', label: 'Overzicht' },
    { id: 'rijders',   label: 'Rijders' },
    { id: 'auto',      label: 'Auto' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{ background: '#0f0f0f', border: `1px solid ${kleur}50`, maxHeight: '90vh', minHeight: 500 }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── LINKER PANEEL ── */}
        <div
          className="relative flex-shrink-0 flex flex-col"
          style={{ width: 240, background: `linear-gradient(180deg, ${kleur}22 0%, #0a0a0a 60%)`, overflowY: 'auto', maxHeight: '90vh' }}
        >
          <div className="px-5 pt-5 pb-1">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[2px]" style={{ color: kleur }}>
              {team.klasse}
            </span>
          </div>
          <div className="px-5 pb-2">
            <div className="font-head font-black text-5xl leading-none" style={{ color: kleur }}>
              #{nrStr(team)}
            </div>
            <div className="font-head font-black text-lg uppercase text-white mt-1 leading-tight">
              {team.naam}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-0.5 h-3 rounded-full" style={{ background: kleur }} />
              <span className="font-ui text-xs font-bold uppercase" style={{ color: kleur }}>{team.fabrikant}</span>
            </div>
            <div className="mt-2">
              <KlasseBadge klasse={team.klasse} />
            </div>
          </div>

          {/* Auto afbeelding links */}
          <div
            className="mx-3 my-3 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${kleur}15, rgba(255,255,255,0.02))`, border: `1px solid ${kleur}30`, height: 140 }}
          >
            <img
              src={carSrc(team)}
              alt={team.carModel}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12, filter: `drop-shadow(0 4px 16px ${kleur}50)` }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.08' }}
            />
          </div>

          {/* Team info */}
          <div className="px-4 py-3 space-y-2.5">
            {[
              { icon: '🏎️', label: 'Auto',    val: team.carModel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
              { icon: '🏁', label: 'Klasse',  val: team.klasse },
              { icon: '🔢', label: 'Nummer',  val: `#${nrStr(team)}` },
              { icon: '👥', label: 'Rijders', val: `${team.drivers.length} coureurs` },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                  <div className="font-ui text-xs text-white/80">{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pb-5">
            <p className="font-ui text-[11px] text-white/40 leading-relaxed">{team.info}</p>
          </div>
        </div>

        {/* ── RECHTER PANEEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex items-center justify-between px-6 pt-5 flex-shrink-0"
            style={{ borderBottom: `1px solid ${kleur}25` }}
          >
            <div className="flex gap-1">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all"
                  style={tab === t.id
                    ? { color: kleur, borderBottom: `2px solid ${kleur}` }
                    : { color: 'rgba(255,255,255,0.35)', borderBottom: '2px solid transparent' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm mb-1"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* ── OVERZICHT TAB ── */}
            {tab === 'overzicht' && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Team',      val: team.naam },
                    { label: 'Nummer',    val: `#${nrStr(team)}` },
                    { label: 'Fabrikant', val: team.fabrikant },
                    { label: 'Klasse',    val: team.klasse },
                    { label: 'Auto',      val: team.carModel.split('-').slice(-2).join(' ').toUpperCase() },
                    { label: 'Coureurs',  val: String(team.drivers.length) },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mb-1">{label}</div>
                      <div className="font-ui text-sm font-semibold text-white truncate">{val}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: kleur }} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">
                      {team.fabrikant} · 2026 WEC
                    </span>
                  </div>
                  <div
                    className="rounded-xl flex items-center justify-center p-4"
                    style={{ background: `linear-gradient(135deg, ${kleur}12, rgba(255,255,255,0.02))`, border: `1px solid ${kleur}25`, height: 150 }}
                  >
                    <img
                      src={carSrc(team)}
                      alt={`${team.naam} #${nrStr(team)}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 6px 20px ${kleur}60)` }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.08' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: kleur }} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Rijders</span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {team.drivers.map(d => (
                      <div key={d.id} className="flex flex-col items-center gap-1.5">
                        <div
                          className="rounded-xl overflow-hidden"
                          style={{ width: 72, height: 90, background: 'rgba(255,255,255,0.04)', border: `1px solid ${kleur}30` }}
                        >
                          <img
                            src={driverSrc(team, d)}
                            alt={d.naam}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.08' }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <VlagImg emoji={d.vlag} size={12} />
                          </div>
                          <div className="font-head font-bold text-[11px] text-white leading-tight">
                            {d.naam.split(' ').pop()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── RIJDERS TAB ── */}
            {tab === 'rijders' && (
              <div className="space-y-3">
                {team.drivers.map(d => (
                  <div
                    key={d.id}
                    className="flex items-center gap-4 rounded-xl p-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${kleur}20` }}
                  >
                    <div
                      className="flex-shrink-0 rounded-xl overflow-hidden"
                      style={{ width: 76, height: 95, background: 'rgba(255,255,255,0.03)' }}
                    >
                      <img
                        src={driverSrc(team, d)}
                        alt={d.naam}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.08' }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-ui text-sm text-white/50">
                        {d.naam.split(' ').slice(0, -1).join(' ')}
                      </div>
                      <div className="font-head font-black text-2xl uppercase text-white leading-tight">
                        {d.naam.split(' ').pop()}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <VlagImg emoji={d.vlag} size={18} />
                        <div className="w-0.5 h-3 rounded-full" style={{ background: kleur }} />
                        <span className="font-ui text-xs text-white/40">{d.nationaliteit}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-4xl opacity-20 select-none">{d.vlag}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── AUTO TAB ── */}
            {tab === 'auto' && (
              <div className="space-y-5">
                <div>
                  <div className="font-head font-black text-2xl text-white mb-0.5">
                    {team.carModel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="font-ui text-xs text-white/40 uppercase tracking-wider">2026 · {team.klasse}</div>
                </div>
                <div
                  className="rounded-2xl flex items-center justify-center p-6"
                  style={{ background: `linear-gradient(135deg, ${kleur}15, rgba(255,255,255,0.02))`, border: `1px solid ${kleur}30`, height: 190 }}
                >
                  <img
                    src={carSrc(team)}
                    alt={`${team.naam} #${nrStr(team)}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 8px 24px ${kleur}70)` }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.08' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '🏎️', label: 'Model',     val: team.carModel.split('-').slice(-2).join(' ').toUpperCase() },
                    { icon: '🏗️', label: 'Fabrikant', val: team.fabrikant },
                    { icon: '🏁', label: 'Klasse',    val: team.klasse },
                    { icon: '🔢', label: 'Nummer',    val: `#${nrStr(team)}` },
                  ].map(({ icon, label, val }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3 flex items-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <span className="text-lg">{icon}</span>
                      <div>
                        <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                        <div className="font-ui text-sm font-semibold text-white">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="font-ui text-sm text-white/60 leading-relaxed">{team.info}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hoofd pagina ─────────────────────────────────────────────────────────────
export default function WEC() {
  const [geselecteerd, setGeselecteerd] = useState<Team | null>(null)
  const [filterKlasse, setFilterKlasse] = useState<string>('Alle')
  const [zoek, setZoek] = useState('')

  const klassen = ['Alle', 'Hypercar', 'GT3 (LMGT3)']

  const gefilterd = TEAMS.filter(t => {
    const matchKlasse = filterKlasse === 'Alle' || t.klasse === filterKlasse
    const matchZoek   = !zoek || [t.naam, t.fabrikant, ...t.drivers.map(d => d.naam)]
      .some(s => s.toLowerCase().includes(zoek.toLowerCase()))
    return matchKlasse && matchZoek
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

      {/* ── Hero ── */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-brand-card border border-brand-border">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-head font-black text-3xl sm:text-4xl uppercase tracking-wide leading-none">
                World Endurance Championship
              </h1>
              <SeriesBadge series="wec" size="md" />
            </div>
            <p className="font-ui text-sm text-brand-muted">FIA WEC 2026 · Hypercar · GT3 (LMGT3)</p>
          </div>
          <div className="flex gap-6">
            {[{ l: 'Teams', v: TEAMS.length }, { l: 'Rijders', v: TEAMS.reduce((s,t) => s + t.drivers.length, 0) }].map(s => (
              <div key={s.l} className="text-center">
                <div className="font-head text-3xl font-black text-brand-orange">{s.v}</div>
                <div className="font-ui text-xs text-brand-muted uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Zoek team of rijder…" value={zoek} onChange={e => setZoek(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-lg pl-8 pr-4 py-2 font-ui text-sm text-brand-light placeholder:text-brand-muted focus:outline-none focus:border-brand-orange/50 transition-colors" />
        </div>
        <div className="flex gap-1.5">
          {klassen.map(k => (
            <button key={k} onClick={() => setFilterKlasse(k)}
              className={`px-3 py-2 rounded-lg font-ui text-xs font-semibold uppercase tracking-wider border transition-all duration-200 ${filterKlasse === k ? 'text-white border-transparent' : 'text-brand-muted border-brand-border hover:border-brand-border/80'}`}
              style={filterKlasse === k && k !== 'Alle' ? { background: KLASSE_KLEUR[k], borderColor: KLASSE_KLEUR[k] }
                : filterKlasse === k ? { background: '#333', borderColor: '#444' } : {}}>
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* ── Klasse groepen ── */}
      {(['Hypercar', 'GT3 (LMGT3)'] as const).map(klasse => {
        const teams = gefilterd.filter(t => t.klasse === klasse)
        if (teams.length === 0) return null
        const kl = KLASSE_KLEUR[klasse]
        return (
          <div key={klasse} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: kl }} />
              <h2 className="font-head font-black text-xl uppercase tracking-wide" style={{ color: kl }}>{klasse}</h2>
              <div className="flex-1 h-px bg-brand-border" />
              <span className="font-ui text-xs text-brand-muted">{teams.length} teams</span>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
              {teams.map(team => (
                <TeamRij key={team.id} team={team} onClick={() => setGeselecteerd(team)} />
              ))}
            </div>
          </div>
        )
      })}

      {gefilterd.length === 0 && (
        <div className="text-center py-16 text-brand-muted">
          <p className="font-head text-xl">Geen teams gevonden</p>
          <p className="font-ui text-sm mt-1">Pas je zoekterm of filter aan.</p>
        </div>
      )}

      {/* ── Modal ── */}
      {geselecteerd && (
        <TeamModal team={geselecteerd} onClose={() => setGeselecteerd(null)} />
      )}
    </div>
  )
}
