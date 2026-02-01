import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { CityCard } from '../components/CityCard';
import { Settings } from '../components/Settings';
import { HeaderAuth } from '../components/HeaderAuth';
import { DEFAULT_CITIES } from '../constants/defaultCities';
import type { RootState } from '../store';

export function Dashboard() {
  const favorites = useSelector((s: RootState) => s.favorites.list);
  const citiesToShow = favorites.length > 0 ? favorites : DEFAULT_CITIES;
  const isDefaultView = favorites.length === 0;

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <div className="fixed inset-0 bg-linear-to-br from-sky-100/80 via-white to-sky-50/60 pointer-events-none" />

      <header className="relative z-50 overflow-x-hidden border-b border-sky-200/60 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:flex-nowrap">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-sky-800 hover:text-sky-600 sm:text-xl">
            <span className="text-xl sm:text-2xl">☀️</span>
            <span className="whitespace-nowrap">Weather Analytics</span>
          </Link>
          <div className="flex min-w-0 flex-1 basis-full flex-wrap items-center justify-end gap-2 sm:basis-auto sm:flex-0 sm:gap-3 md:flex-nowrap md:basis-auto">
            <SearchBar />
            <Settings />
            <HeaderAuth />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">
          {isDefaultView ? 'Weather around the world' : 'Your cities'}
        </h1>
        <p className="mb-8 text-slate-600">
          {isDefaultView
            ? 'Click a city for forecast and charts, or search to add your own.'
            : 'Click a card for details. Search to add more cities.'}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {citiesToShow.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              showRemove={!isDefaultView}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
