import { getCircuitWeather, weatherIcon } from '@/services/weatherApi'
import { useQuery } from '@tanstack/react-query'
import type { Circuit } from '@/types'

interface Props {
  circuit:      Circuit
  showWeather?: boolean
  showRecord?:  boolean
  size?:        'sm' | 'md' | 'lg'
}

// ─── SVG imports — alle circuits in src/assets/circuits/ ─────────────────────

// F1
import f1_abu_dhabi      from '@/assets/circuits/f1_abu_dhabi_gp.svg'
import f1_australian     from '@/assets/circuits/f1_australian_gp.svg'
import f1_austrian       from '@/assets/circuits/f1_austrian_gp.svg'
import f1_azerbaijan     from '@/assets/circuits/f1_azerbaijan_gp.svg'
import f1_belgian        from '@/assets/circuits/f1_belgian_gp.svg'
import f1_brazilian      from '@/assets/circuits/f1_brazilian_gp.svg'
import f1_british        from '@/assets/circuits/f1_british_gp.svg'
import f1_canada         from '@/assets/circuits/f1_canada_gp.svg'
import f1_chinese        from '@/assets/circuits/f1_chinese_gp.svg'
import f1_dutch          from '@/assets/circuits/f1_dutch_gp.svg'
import f1_hungarian      from '@/assets/circuits/f1_hungarian_gp.svg'
import f1_italian        from '@/assets/circuits/f1_italian_gp.svg'
import f1_japanese       from '@/assets/circuits/f1_japanese_gp.svg'
import f1_las_vegas      from '@/assets/circuits/f1_las_vegas_gp.svg'
import f1_madrid         from '@/assets/circuits/f1_madrid_gp.svg'
import f1_mexico         from '@/assets/circuits/f1_mexico_gp.svg'
import f1_miami          from '@/assets/circuits/f1_miami_gp.svg'
import f1_monaco         from '@/assets/circuits/f1_monaco_gp.svg'
import f1_qatar          from '@/assets/circuits/f1_qatar_gp.svg'
import f1_saudi          from '@/assets/circuits/f1_saudi_arabian_gp.svg'
import f1_singapore      from '@/assets/circuits/f1_singapore_gp.svg'
import f1_spanish        from '@/assets/circuits/f1_spanish_gp.svg'
import f1_us             from '@/assets/circuits/f1_us_gp.svg'

// GT3
import gt3_hockenheim    from '@/assets/circuits/gt3_hockenheim_gt.svg'
import gt3_nurburgring   from '@/assets/circuits/gt3_nurburgring_24h.svg'
import gt3_paul_ricard   from '@/assets/circuits/gt3_paul_ricard_1000km.svg'
import gt3_silverstone   from '@/assets/circuits/gt3_silverstone_gt.svg'
import gt3_spa           from '@/assets/circuits/gt3_spa_24h.svg'

// IMSA
import imsa_canadian_tire from '@/assets/circuits/imsa_canadian_tire.svg'
import imsa_daytona       from '@/assets/circuits/imsa_daytona_24h.svg'
import imsa_detroit       from '@/assets/circuits/imsa_detroit.svg'
import imsa_indianapolis  from '@/assets/circuits/imsa_indianapolis.svg'
import imsa_laguna_seca   from '@/assets/circuits/imsa_laguna_seca.svg'
import imsa_long_beach    from '@/assets/circuits/imsa_long_beach.svg'
import imsa_petit_le_mans from '@/assets/circuits/imsa_petit_le_mans.svg'
import imsa_road_america  from '@/assets/circuits/imsa_road_america.svg'
import imsa_sebring       from '@/assets/circuits/imsa_sebring_12h.svg'
import imsa_vir           from '@/assets/circuits/imsa_vir.svg'
import imsa_virginia      from '@/assets/circuits/imsa_virginia.svg'

// MotoGP
import motogp_americas    from '@/assets/circuits/motogp_americas_gp.svg'
import motogp_australian  from '@/assets/circuits/motogp_australian_gp.svg'
import motogp_austrian    from '@/assets/circuits/motogp_austrian_gp.svg'
import motogp_balton_park from '@/assets/circuits/motogp__balton_park.svg'
import motogp_brazilian   from '@/assets/circuits/motogp_brazilian_gp.svg'
import motogp_british     from '@/assets/circuits/motogp_british_gp.svg'
import motogp_catalan     from '@/assets/circuits/motogp_catalan_gp.svg'
import motogp_dutch_tt    from '@/assets/circuits/motogp_dutch_tt_gp.svg'
import motogp_french      from '@/assets/circuits/motogp_french_gp.svg'
import motogp_german      from '@/assets/circuits/motogp_german_gp.svg'
import motogp_indonesian  from '@/assets/circuits/motogp_indonesian_gp.svg'
import motogp_italian     from '@/assets/circuits/motogp_italian_gp.svg'
import motogp_japanese    from '@/assets/circuits/motogp_japanese_gp.svg'
import motogp_malaysian   from '@/assets/circuits/motogp_malaysian_gp.svg'
import motogp_portuguese  from '@/assets/circuits/motogp_portuguese_gp.svg'
import motogp_qatar       from '@/assets/circuits/motogp_qatar_gp.svg'
import motogp_san_marino  from '@/assets/circuits/motogp_san_marino_gp.svg'
import motogp_spanish     from '@/assets/circuits/motogp_spanish_gp.svg'
import motogp_thai        from '@/assets/circuits/motogp_thai_gp.svg'
import motogp_valencian   from '@/assets/circuits/motogp_valencian_gp.svg'

// WEC
import wec_bahrain        from '@/assets/circuits/wec_bahrain_8h.svg'
import wec_fuji           from '@/assets/circuits/wec_fuji_6h.svg'
import wec_imola          from '@/assets/circuits/wec_imola_6h.svg'
import wec_le_mans        from '@/assets/circuits/wec_le_mans_24h.svg'
import wec_lone_star      from '@/assets/circuits/wec_lone_star_le_mans.svg'
import wec_qatar          from '@/assets/circuits/wec_qatar_1812km.svg'
import wec_sao_paulo      from '@/assets/circuits/wec_sao_paulo_6h.svg'
import wec_spa            from '@/assets/circuits/wec_spa_6h.svg'

// WorldSBK
import wsb_aragon         from '@/assets/circuits/worldsbk_aragon.svg'
import wsb_assen          from '@/assets/circuits/worldsbk_assen.svg'
import wsb_balton_park    from '@/assets/circuits/worldsbk_balton_park.svg'
import wsb_cremona        from '@/assets/circuits/worldsbk_cremona.svg'
import wsb_donington      from '@/assets/circuits/worldsbk_donington.svg'
import wsb_estoril        from '@/assets/circuits/worldsbk_estoril.svg'
import wsb_indonesia      from '@/assets/circuits/worldsbk_indonesia.svg'
import wsb_jerez          from '@/assets/circuits/worldsbk_jerez.svg'
import wsb_magny_cours    from '@/assets/circuits/worldsbk_magny_cours.svg'
import wsb_misano         from '@/assets/circuits/worldsbk_misano.svg'
import wsb_most           from '@/assets/circuits/worldsbk_most.svg'
import wsb_phillip_island from '@/assets/circuits/worldsbk_phillip_island.svg'
import wsb_portimao       from '@/assets/circuits/worldsbk_portimao.svg'

// ─── Mapping: circuit.id (Firebase race-id) → SVG url ────────────────────────
// De id's komen uit de Kalender Firebase keys, bijv. "canada_gp", "le_mans_24h"

const CIRCUIT_SVG: Record<string, string> = {
  // F1
  'abu_dhabi_gp':    f1_abu_dhabi,
  'australian_gp':   f1_australian,    // wordt ook door MotoGP gebruikt — override per serie indien nodig
  'austrian_gp':     f1_austrian,
  'azerbaijan_gp':   f1_azerbaijan,
  'belgian_gp':      f1_belgian,
  'brazilian_gp':    f1_brazilian,
  'british_gp':      f1_british,
  'canada_gp':       f1_canada,
  'chinese_gp':      f1_chinese,
  'dutch_gp':        f1_dutch,
  'hungarian_gp':    f1_hungarian,
  'italian_gp':      f1_italian,
  'japanese_gp':     f1_japanese,
  'las_vegas_gp':    f1_las_vegas,
  'madrid_gp':       f1_madrid,
  'mexico_gp':       f1_mexico,
  'miami_gp':        f1_miami,
  'monaco_gp':       f1_monaco,
  'qatar_gp':        f1_qatar,
  'saudi_arabian_gp': f1_saudi,
  'singapore_gp':    f1_singapore,
  'spanish_gp':      f1_spanish,
  'us_gp':           f1_us,

  // GT3
  'hockenheim_gt':       gt3_hockenheim,
  'nurburgring_24h':     gt3_nurburgring,
  'paul_ricard_1000km':  gt3_paul_ricard,
  'silverstone_gt':      gt3_silverstone,
  'spa_24h':             gt3_spa,

  // IMSA
  'canadian_tire':   imsa_canadian_tire,
  'daytona_24h':     imsa_daytona,
  'detroit':         imsa_detroit,
  'indianapolis':    imsa_indianapolis,
  'laguna_seca':     imsa_laguna_seca,
  'long_beach':      imsa_long_beach,
  'petit_le_mans':   imsa_petit_le_mans,
  'road_america':    imsa_road_america,
  'sebring_12h':     imsa_sebring,
  'vir':             imsa_vir,
  'virginia':        imsa_virginia,

  // MotoGP (series-specifieke keys die overlappen met F1 krijgen motogp_ prefix in id)
  'americas_gp':     motogp_americas,
  'catalan_gp':      motogp_catalan,
  'czech_gp':        motogp_catalan,   // geen eigen svg, catalan als fallback
  'dutch_tt':        motogp_dutch_tt,
  'french_gp':       motogp_french,
  'german_gp':       motogp_german,
  'hungarian_gp_moto': motogp_balton_park,
  'indonesian_gp':   motogp_indonesian,
  'malaysian_gp':    motogp_malaysian,
  'portuguese_gp':   motogp_portuguese,
  'qatar_gp_moto':   motogp_qatar,
  'san_marino_gp':   motogp_san_marino,
  'thai_gp':         motogp_thai,
  'valencian_gp':    motogp_valencian,

  // WEC
  'bahrain_8h':        wec_bahrain,
  'fuji_6h':           wec_fuji,
  'imola_6h':          wec_imola,
  'le_mans_24h':       wec_le_mans,
  'lone_star_le_mans': wec_lone_star,
  'qatar_1812km':      wec_qatar,
  'sao_paulo_6h':      wec_sao_paulo,
  'spa_6h':            wec_spa,

  // WorldSBK
  'aragon':          wsb_aragon,
  'assen':           wsb_assen,
  'balaton_park':    wsb_balton_park,
  'cremona':         wsb_cremona,
  'donington':       wsb_donington,
  'estoril':         wsb_estoril,
  'indonesia':       wsb_indonesia,
  'jerez':           wsb_jerez,
  'magny_cours':     wsb_magny_cours,
  'misano':          wsb_misano,
  'most':            wsb_most,
  'phillip_island':  wsb_phillip_island,
  'portimao':        wsb_portimao,
}

// Haal SVG op op basis van circuit.id, met fallback op serie+id combinaties
function getCircuitSvg(circuitId: string, serie?: string): string | null {
  // Directe match
  if (CIRCUIT_SVG[circuitId]) return CIRCUIT_SVG[circuitId]

  // MotoGP circuits die dezelfde naam delen als F1 — gebruik MotoGP versie
  if (serie === 'MotoGP' || serie === 'motogp') {
    const motoMap: Record<string, string> = {
      'australian_gp': motogp_australian,
      'austrian_gp':   motogp_austrian,
      'british_gp':    motogp_british,
      'italian_gp':    motogp_italian,
      'japanese_gp':   motogp_japanese,
      'spanish_gp':    motogp_spanish,
      'brazilian_gp':  motogp_brazilian,
      'qatar_gp':      motogp_qatar,
    }
    if (motoMap[circuitId]) return motoMap[circuitId]
  }

  return null
}

// ─── Circuit SVG component ────────────────────────────────────────────────────

function CircuitSVG({
  circuitId,
  serie,
  size,
}: {
  circuitId: string
  serie?:    string
  size:      Props['size']
}) {
  const svgUrl = getCircuitSvg(circuitId, serie)
  const dims   = size === 'sm' ? 160 : size === 'lg' ? 400 : 280

  if (svgUrl) {
    return (
      <img
        src={svgUrl}
        alt={circuitId}
        width={dims}
        className="max-w-full object-contain"
        style={{
          filter: 'invert(1) sepia(1) saturate(5) hue-rotate(340deg) brightness(1.1) drop-shadow(0 0 6px rgba(255,102,0,0.4))',
        }}
      />
    )
  }

  // Fallback: eenvoudige placeholder als er geen SVG beschikbaar is
  return (
    <svg
      viewBox="0 0 380 210"
      width={dims}
      className="max-w-full opacity-30"
    >
      <rect x="40" y="40" width="300" height="130" rx="30"
        fill="none" stroke="#ff6600" strokeWidth="3" strokeDasharray="8 4" />
      <text x="190" y="115" textAnchor="middle" fill="#ff6600"
        fontSize="12" fontFamily="monospace">
        {circuitId.replace(/_/g, ' ').toUpperCase()}
      </text>
    </svg>
  )
}

// ─── Weather widget ───────────────────────────────────────────────────────────

function WeatherWidget({ circuit }: { circuit: Circuit }) {
  const lat = 48.0
  const lon = 4.0

  const { data: weather, isLoading } = useQuery({
    queryKey:  ['weather', circuit.id],
    queryFn:   () => getCircuitWeather(lat, lon),
    staleTime: 1000 * 60 * 10,
    enabled:   false,
  })

  if (isLoading) return <div className="font-ui text-xs text-brand-muted animate-pulse">Weer laden...</div>
  if (!weather)  return null

  return (
    <div className="flex items-center gap-2 bg-brand-dark rounded px-3 py-2">
      <span className="text-xl">{weatherIcon(weather.weatherCode, weather.isDay)}</span>
      <div>
        <div className="font-head text-sm font-bold">{weather.temperature}°C</div>
        <div className="font-ui text-[10px] text-brand-muted">{weather.weatherLabel}</div>
      </div>
      <div className="ml-2 font-ui text-[10px] text-brand-muted">
        💨 {weather.windspeed} km/h
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CircuitMap({
  circuit,
  showWeather = false,
  showRecord  = true,
  size        = 'md',
}: Props) {
  // serie wordt doorgegeven via circuit.id prefix of apart via de aanroeper
  // We detecteren het hier op basis van het id-formaat
  const serie = (circuit as any).serie as string | undefined

  return (
    <div className="card p-4">
      {/* Circuit naam */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-head text-lg font-bold uppercase tracking-wide">
            {circuit.flagEmoji} {circuit.name}
          </h3>
          <p className="font-ui text-xs text-brand-muted">
            {circuit.city}, {circuit.country}
          </p>
        </div>
        {showWeather && <WeatherWidget circuit={circuit} />}
      </div>

      {/* SVG circuit layout */}
      <div className="flex justify-center bg-brand-dark rounded-lg py-4 mb-4 min-h-[120px] items-center">
        <CircuitSVG circuitId={circuit.id} serie={serie} size={size} />
      </div>

      {/* Stats rij */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-brand-dark rounded p-2.5 text-center">
          <div className="font-head text-base font-bold text-brand-orange">{circuit.lengthKm} km</div>
          <div className="font-ui text-[10px] text-brand-muted uppercase tracking-wider">Lengte</div>
        </div>
        <div className="bg-brand-dark rounded p-2.5 text-center">
          <div className="font-head text-base font-bold text-brand-orange">{circuit.turns}</div>
          <div className="font-ui text-[10px] text-brand-muted uppercase tracking-wider">Bochten</div>
        </div>
        {showRecord && (
          <div className="bg-brand-dark rounded p-2.5 text-center">
            <div className="font-head text-base font-bold text-brand-orange">{circuit.lapRecord.time}</div>
            <div className="font-ui text-[10px] text-brand-muted uppercase tracking-wider">Ronderecord</div>
          </div>
        )}
      </div>

      {showRecord && (
        <div className="mt-2 font-ui text-[10px] text-brand-muted text-center">
          {circuit.lapRecord.driver} · {circuit.lapRecord.year}
        </div>
      )}
    </div>
  )
}
