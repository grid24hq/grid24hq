import axios from 'axios'

// Uses Open-Meteo — completely free, no API key required
// Docs: https://open-meteo.com/en/docs

const BASE = 'https://api.open-meteo.com/v1'

export interface CircuitWeather {
  temperature: number       // °C
  windspeed: number         // km/h
  windDirection: number     // degrees
  weatherCode: number       // WMO code
  weatherLabel: string      // Human readable
  isDay: boolean
  humidity: number
  precipitation: number     // mm
  feelsLike: number
}

export interface WeatherForecastDay {
  date: string
  maxTemp: number
  minTemp: number
  precipitationSum: number
  weatherCode: number
  weatherLabel: string
  windspeedMax: number
}

// ─── WMO Weather interpretation codes ────────────────────────────────────────

function weatherLabel(code: number): string {
  if (code === 0)              return 'Helder'
  if (code <= 2)               return 'Gedeeltelijk bewolkt'
  if (code === 3)              return 'Bewolkt'
  if (code <= 49)              return 'Mist'
  if (code <= 59)              return 'Motregen'
  if (code <= 69)              return 'Regen'
  if (code <= 79)              return 'Sneeuw'
  if (code <= 84)              return 'Regenbuien'
  if (code <= 94)              return 'Onweer'
  return 'Zwaar onweer'
}

// ─── Current conditions at a circuit ─────────────────────────────────────────

export async function getCircuitWeather(
  lat: number,
  lon: number,
): Promise<CircuitWeather> {
  const { data } = await axios.get(`${BASE}/forecast`, {
    params: {
      latitude:              lat,
      longitude:             lon,
      current:               [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'is_day',
      ].join(','),
      timezone:              'auto',
      forecast_days:         1,
    },
  })

  const c = data.current
  return {
    temperature:  c.temperature_2m,
    windspeed:    c.wind_speed_10m,
    windDirection:c.wind_direction_10m,
    weatherCode:  c.weather_code,
    weatherLabel: weatherLabel(c.weather_code),
    isDay:        c.is_day === 1,
    humidity:     c.relative_humidity_2m,
    precipitation:c.precipitation,
    feelsLike:    c.apparent_temperature,
  }
}

// ─── 7-day forecast for race weekend planning ─────────────────────────────────

export async function getCircuitForecast(
  lat: number,
  lon: number,
  days: number = 7,
): Promise<WeatherForecastDay[]> {
  const { data } = await axios.get(`${BASE}/forecast`, {
    params: {
      latitude:       lat,
      longitude:      lon,
      daily:          [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'wind_speed_10m_max',
      ].join(','),
      timezone:       'auto',
      forecast_days:  days,
    },
  })

  const d = data.daily
  return (d.time as string[]).map((date: string, i: number) => ({
    date,
    maxTemp:          d.temperature_2m_max[i],
    minTemp:          d.temperature_2m_min[i],
    precipitationSum: d.precipitation_sum[i],
    weatherCode:      d.weather_code[i],
    weatherLabel:     weatherLabel(d.weather_code[i]),
    windspeedMax:     d.wind_speed_10m_max[i],
  }))
}

// ─── Weather icon helper ──────────────────────────────────────────────────────

export function weatherIcon(code: number, isDay: boolean = true): string {
  if (code === 0)   return isDay ? '☀️' : '🌙'
  if (code <= 2)    return isDay ? '⛅' : '🌤️'
  if (code === 3)   return '☁️'
  if (code <= 49)   return '🌫️'
  if (code <= 69)   return '🌧️'
  if (code <= 79)   return '❄️'
  if (code <= 84)   return '🌦️'
  return '⛈️'
}
