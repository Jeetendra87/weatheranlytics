import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentWeather } from '../store/slices/weatherSlice';
import { removeFavorite } from '../store/slices/favoritesSlice';
import type { City } from '../types/weather';
import type { RootState } from '../store';
import { WeatherIcon } from './WeatherIcon';
import { toDisplayTemp, tempSuffix } from '../utils/units';

interface CityCardProps {
  city: City;
  showRemove?: boolean;
}

export function CityCard({ city, showRemove = true }: CityCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const unit = useSelector((s: RootState) => s.settings.unit);
  const current = useSelector((s: RootState) => s.weather.currentByCity[city.id]);

  useEffect(() => {
    dispatch(fetchCurrentWeather(city));
  }, [dispatch, city.id, city.lat, city.lon]);

  const handleClick = () => navigate(`/city/${encodeURIComponent(city.id)}`);

  if (!current) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex min-h-[180px] w-full cursor-pointer items-center justify-center rounded-2xl border border-sky-200 bg-white shadow-md transition hover:border-sky-400 hover:shadow-lg"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </button>
    );
  }

  const temp = toDisplayTemp(current.temp, unit);
  const suffix = tempSuffix(unit);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative w-full cursor-pointer rounded-2xl border border-sky-200/80 bg-white p-6 text-left shadow-md transition hover:border-sky-400 hover:shadow-xl hover:shadow-sky-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-sky-700">
            {current.cityName}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">{current.country}</p>
        </div>
        <div className="flex items-center gap-2">
          <WeatherIcon code={current.icon} size="lg" className="drop-shadow" />
          {showRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(removeFavorite(city.id));
              }}
              className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-100 hover:text-red-500"
              title="Remove from favorites"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-4xl font-extrabold tracking-tight text-sky-600">{temp}{suffix}</span>
        <span className="text-slate-500">Feels {toDisplayTemp(current.feelsLike, unit)}{suffix}</span>
      </div>
      <p className="mt-2 text-base capitalize text-slate-600">{current.description}</p>
      <div className="mt-4 flex gap-6 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">💧 {current.humidity}%</span>
        <span className="flex items-center gap-1.5">💨 {current.windSpeed} m/s</span>
      </div>
    </button>
  );
}
