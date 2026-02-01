import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppDispatch } from '../store';
import { addFavorite } from '../store/slices/favoritesSlice';
import { fetchCurrentWeather } from '../store/slices/weatherSlice';
import * as weatherApi from '../services/weatherApi';
import type { City } from '../types/weather';

interface SearchBarProps {
  onSelect?: (city: City) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dispatch = useAppDispatch();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const cities = await weatherApi.searchCities(q);
      setResults(cities);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  const handleSelect = (city: City) => {
    dispatch(addFavorite(city));
    dispatch(fetchCurrentWeather(city));
    setQuery('');
    setResults([]);
    setOpen(false);
    onSelect?.(city);
  };

  return (
    <div className="relative w-full min-w-[140px] max-w-[260px] sm:min-w-[160px] sm:max-w-[300px]">
      <div className="flex h-11 items-center rounded-xl border border-sky-200 bg-white shadow-sm">
        <span className="flex h-full items-center pl-4 text-sky-500">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search city..."
          className="h-full w-full bg-transparent py-0 pl-2 pr-4 text-slate-800 placeholder-slate-400 outline-none focus:ring-0"
        />
        {loading && (
          <span className="flex h-full items-center pr-4">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          </span>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-[100] mt-2 max-h-60 overflow-auto rounded-xl border border-sky-200 bg-white py-2 shadow-xl">
          {results.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-slate-700 hover:bg-sky-50"
              >
                <span className="font-medium text-slate-800">{city.name}</span>
                <span className="text-sm text-slate-500">{city.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
