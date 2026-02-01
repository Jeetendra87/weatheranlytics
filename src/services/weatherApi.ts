import axios from 'axios';
import type { City, CurrentWeather, ForecastData, HourlyForecast, DailyForecast } from '../types/weather';

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map<string, { data: unknown; ts: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
}

const API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim();
const BASE = 'https://api.openweathermap.org';

const api = axios.create({ baseURL: BASE, timeout: 10000 });

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      const msg = err.response?.data?.message || err.message || 'Invalid API key';
      return Promise.reject(new Error(`OPENWEATHER_401: ${msg}`));
    }
    return Promise.reject(err);
  }
);

export async function searchCities(query: string): Promise<City[]> {
  if (!query.trim() || query.length < 2) return [];
  const { data } = await api.get<Array<{ name: string; country: string; lat: number; lon: number }>>(
    '/geo/1.0/direct',
    { params: { q: query, limit: 5, appid: API_KEY } }
  );
  return data.map((c) => ({
    id: `${c.lat}-${c.lon}`,
    name: c.name,
    country: c.country,
    lat: c.lat,
    lon: c.lon,
  }));
}

export async function getCurrentWeather(lat: number, lon: number, cityName: string, country: string): Promise<CurrentWeather> {
  const key = `current-${lat}-${lon}`;
  const cached = getCached<CurrentWeather>(key);
  if (cached) return cached;

  const { data } = await api.get('/data/2.5/weather', {
    params: { lat, lon, appid: API_KEY, units: 'metric' },
  });

  const cityId = `${lat}-${lon}`;
  const current: CurrentWeather = {
    cityId,
    cityName,
    country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind?.speed ?? 0),
    windDeg: data.wind?.deg ?? 0,
    pressure: data.main.pressure,
    description: data.weather?.[0]?.description ?? '',
    icon: data.weather?.[0]?.icon ?? '01d',
    visibility: data.visibility ?? 0,
    updatedAt: Date.now(),
  };
  setCache(key, current);
  return current;
}

export async function getForecast(lat: number, lon: number, cityName: string): Promise<ForecastData> {
  const key = `forecast-${lat}-${lon}`;
  const cached = getCached<ForecastData>(key);
  if (cached) return cached;

  const { data } = await api.get('/data/2.5/forecast', {
    params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 40 },
  });

  const hourly: HourlyForecast[] = (data.list ?? []).slice(0, 24).map((item: {
    dt: number;
    main: { temp: number };
    pop?: number;
    wind: { speed: number; deg: number };
    weather: Array<{ icon: string; description: string }>;
  }) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    pop: (item.pop ?? 0) * 100,
    windSpeed: item.wind?.speed ?? 0,
    windDeg: item.wind?.deg ?? 0,
    weather: item.weather ?? [],
  }));

  const dayMap = new Map<number, { min: number; max: number; pop: number; windSpeed: number; windDeg: number; weather: { icon: string; description: string }[] }>();
  (data.list ?? []).forEach((item: {
    dt: number;
    main: { temp: number };
    pop?: number;
    wind: { speed: number; deg: number };
    weather: Array<{ icon: string; description: string }>;
  }) => {
    const day = new Date(item.dt * 1000).toDateString();
    const dayTs = new Date(day).getTime() / 1000;
    const existing = dayMap.get(dayTs);
    const temp = item.main.temp;
    const w = item.weather?.[0] ?? { icon: '01d', description: '' };
    if (!existing) {
      dayMap.set(dayTs, { min: temp, max: temp, pop: (item.pop ?? 0) * 100, windSpeed: item.wind?.speed ?? 0, windDeg: item.wind?.deg ?? 0, weather: [w] });
    } else {
      existing.min = Math.min(existing.min, temp);
      existing.max = Math.max(existing.max, temp);
      existing.pop = Math.max(existing.pop, (item.pop ?? 0) * 100);
    }
  });

  const daily: DailyForecast[] = Array.from(dayMap.entries())
    .sort(([a], [b]) => a - b)
    .slice(0, 7)
    .map(([dt, v]) => ({
      dt,
      temp: { min: Math.round(v.min), max: Math.round(v.max) },
      pop: v.pop,
      windSpeed: v.windSpeed,
      windDeg: v.windDeg,
      weather: v.weather,
    }));

  const result: ForecastData = {
    cityId: `${lat}-${lon}`,
    cityName,
    hourly,
    daily,
    updatedAt: Date.now(),
  };
  setCache(key, result);
  return result;
}
