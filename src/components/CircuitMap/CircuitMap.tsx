import { getCircuitWeather, weatherIcon } from '@/services/weatherApi'
import { useQuery } from '@tanstack/react-query'
import type { Circuit } from '@/types'

interface Props {
  circuit: Circuit
  showWeather?: boolean
  showRecord?:  boolean
  size?: 'sm' | 'md' | 'lg'
}

// ─── Known circuit SVG paths (simplified outlines) ────────────────────────────
// Key = circuit.id

const CIRCUIT_PATHS: Record<string, string> = {
  'le-mans': 'M50,180 L50,80 Q52,40 80,30 L200,20 Q260,15 300,40 L340,70 Q360,90 355,130 L350,160 Q345,185 310,192 L100,195 Q52,193 50,180 Z',
  'spa':     'M40,160 L40,90 Q42,50 70,35 L160,20 Q220,12 270,35 L320,75 Q345,100 340,140 L335,165 Q330,185 295,190 L90,192 Q42,190 40,160 Z',
  'nurburgring': 'M30,150 L32,60 Q35,25 65,18 L170,14 Q240,10 280,30 L330,65 Q355,90 350,135 L345,160 Q340,180 305,185 L75,188 Q30,186 30,150 Z M120,14 L118,80 Q118,110 140,115',
  'monza':   'M60,170 L60,60 Q62,25 90,18 L200,14 Q260,10 295,32 L330,65 Q348,88 344,132 L340,162 Q336,180 300,186 L100,188 Q60,186 60,170 Z',
  'default': 'M45,165 L45,75 Q47,38 75,28 L190,18 Q255,12 295,38 L335,72 Q356,96 350,138 L344,164 Q340,183 302,189 L95,191 Q45,189 45,165 Z',
}

function CircuitSVG({ circuitId, size }: { circuitId: string; size: Props['size'] }) {
  const path  = CIRCUIT_PATHS[circuitId] ?? CIRCUIT_PATHS['default']
  const dims  = size === 'sm' ? 160 : size === 'lg' ? 400 : 280
  const viewH = 210

  return (
    <svg
      viewBox={`0 0 380 ${viewH}`}
      width={dims}
      className="max-w-full"
      style={{ filter: 'drop-shadow(0 0 8px rgba(255,102,0,0.3))' }}
    >
      {/* Track shadow */}
      <path
        d={path}
        fill="none"
        stroke="rgba(255,102,0,0.15)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Track outline */}
      <path
        d={path}
        fill="none"
        stroke="#ff6600"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* Start/finish marker */}
      <circle cx="50" cy="165" r="5" fill="#e63300" opacity="0.9" />
      <line x1="50" y1="150" x2="50" y2="180" stroke="#e63300" strokeWidth="2" opacity="0.8" />
    </svg>
  )
}

// ─── Weather widget ───────────────────────────────────────────────────────────

function WeatherWidget({ circuit }: { circuit: Circuit }) {
  // We'd need lat/lon in the Circuit type — using dummy coords for now
  const lat = 48.0  // TODO: add to Circuit type
  const lon = 4.0

  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', circuit.id],
    queryFn:  () => getCircuitWeather(lat, lon),
    staleTime: 1000 * 60 * 10, // 10 min
    enabled: false, // Enable when real coords are available
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
  size = 'md',
}: Props) {
  return (
    <div className="card p-4">
      {/* Circuit name */}
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

      {/* SVG track layout */}
      <div className="flex justify-center bg-brand-dark rounded-lg py-4 mb-4">
        <CircuitSVG circuitId={circuit.id} size={size} />
      </div>

      {/* Stats row */}
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
