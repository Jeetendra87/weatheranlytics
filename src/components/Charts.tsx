import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { toDisplayTemp, tempSuffix } from '../utils/units';
import type { HourlyForecast, DailyForecast } from '../types/weather';

interface TempChartProps {
  hourly: HourlyForecast[];
  unit: 'celsius' | 'fahrenheit';
}

export function TempChart({ hourly, unit }: TempChartProps) {
  const data = hourly.slice(0, 12).map((h) => ({
    time: new Date(h.dt * 1000).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    temp: toDisplayTemp(h.temp, unit),
    full: `${toDisplayTemp(h.temp, unit)}${tempSuffix(unit)}`,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#334155' }}
            formatter={(value: number) => [`${value}${tempSuffix(unit)}`, 'Temp']}
          />
          <Line type="monotone" dataKey="temp" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PrecipChartProps {
  daily: DailyForecast[];
}

export function PrecipChart({ daily }: PrecipChartProps) {
  const data = daily.map((d) => ({
    day: new Date(d.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
    pop: Math.round(d.pop ?? 0),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value}%`, 'Precip']}
          />
          <Bar dataKey="pop" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface WindChartProps {
  hourly: HourlyForecast[];
}

const WIND_COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e'];

export function WindChart({ hourly }: WindChartProps) {
  const data = hourly.slice(0, 8).map((h, i) => ({
    name: new Date(h.dt * 1000).toLocaleTimeString('en', { hour: '2-digit' }),
    speed: Math.round(h.windSpeed * 10) / 10,
    fill: WIND_COLORS[i % WIND_COLORS.length],
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} unit=" m/s" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value} m/s`, 'Wind']}
          />
          <Bar dataKey="speed" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
