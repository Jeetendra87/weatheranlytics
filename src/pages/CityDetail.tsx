import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { fetchCurrentWeather, fetchForecast } from '../store/slices/weatherSlice';
import { DEFAULT_CITIES } from '../constants/defaultCities';
import type { RootState } from '../store';
import { WeatherIcon } from '../components/WeatherIcon';
import { TempChart, PrecipChart, WindChart } from '../components/Charts';
import { toDisplayTemp, tempSuffix } from '../utils/units';

export function CityDetail() {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const unit = useSelector((s: RootState) => s.settings.unit);
  const favorites = useSelector((s: RootState) => s.favorites.list);
  const current = useSelector((s: RootState) =>
    cityId ? s.weather.currentByCity[cityId] ?? null : null
  );
  const forecast = useSelector((s: RootState) =>
    cityId ? s.weather.forecastByCity[cityId] ?? null : null
  );

  const city = favorites.find((c) => c.id === cityId) ?? DEFAULT_CITIES.find((c) => c.id === cityId);

  useEffect(() => {
    if (!city) return;
    dispatch(fetchCurrentWeather(city));
    dispatch(fetchForecast({ city }));
  }, [dispatch, city?.id, city]);

  if (!city) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50">
        <div className="text-center">
          <p className="text-slate-600">City not found.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 rounded-xl bg-sky-500 px-5 py-2.5 font-medium text-white hover:bg-sky-600 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  const temp = toDisplayTemp(current.temp, unit);
  const suffix = tempSuffix(unit);

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <div className="fixed inset-0 bg-linear-to-br from-sky-100/80 via-white to-sky-50/60 pointer-events-none" />

      <header className="relative border-b border-sky-200/60 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-slate-700 shadow-sm hover:bg-sky-50 hover:border-sky-300 cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            {current.cityName}, {current.country}
          </h1>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section className="mb-8 rounded-2xl border border-sky-200/80 bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <WeatherIcon code={current.icon} size="lg" className="drop-shadow" />
              <div>
                <p className="text-4xl font-extrabold tracking-tight text-sky-600">{temp}{suffix}</p>
                <p className="mt-1 capitalize text-slate-600">{current.description}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Feels like {toDisplayTemp(current.feelsLike, unit)}{suffix}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3">
                <p className="text-xs text-slate-500">Humidity</p>
                <p className="font-semibold text-slate-800">{current.humidity}%</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3">
                <p className="text-xs text-slate-500">Wind</p>
                <p className="font-semibold text-slate-800">{current.windSpeed} m/s</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3">
                <p className="text-xs text-slate-500">Pressure</p>
                <p className="font-semibold text-slate-800">{current.pressure} hPa</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3">
                <p className="text-xs text-slate-500">Visibility</p>
                <p className="font-semibold text-slate-800">{(current.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
          </div>
        </section>

        {forecast && forecast.daily.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Daily forecast</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {forecast.daily.slice(0, 7).map((d) => (
                <div
                  key={d.dt}
                  className="flex items-center justify-between rounded-xl border border-sky-200 bg-white px-4 py-3 shadow-sm"
                >
                  <span className="font-medium text-slate-600">
                    {new Date(d.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                  <WeatherIcon code={d.weather[0]?.icon ?? '01d'} size="sm" />
                  <span className="font-semibold text-sky-600">
                    {toDisplayTemp(d.temp.min, unit)}–{toDisplayTemp(d.temp.max, unit)}{suffix}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {forecast && forecast.hourly.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Next 24h (3h steps)</h2>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-3">
                {forecast.hourly.slice(0, 8).map((h) => (
                  <div
                    key={h.dt}
                    className="min-w-[88px] rounded-xl border border-sky-200 bg-white px-3 py-3 text-center shadow-sm"
                  >
                    <p className="text-xs text-slate-500">
                      {new Date(h.dt * 1000).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <WeatherIcon code={h.weather[0]?.icon ?? '01d'} size="sm" className="mx-auto my-1" />
                    <p className="font-semibold text-sky-600">{toDisplayTemp(h.temp, unit)}{suffix}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {forecast && (
          <section className="space-y-8">
            <h2 className="text-lg font-bold text-slate-800">Charts</h2>
            <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-slate-600">Temperature trend</h3>
              <TempChart hourly={forecast.hourly} unit={unit} />
            </div>
            <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-slate-600">Precipitation chance</h3>
              <PrecipChart daily={forecast.daily} />
            </div>
            <div className="rounded-2xl border border-sky-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-slate-600">Wind speed</h3>
              <WindChart hourly={forecast.hourly} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
