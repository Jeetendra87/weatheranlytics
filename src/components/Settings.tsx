import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { toggleUnit } from '../store/slices/settingsSlice';
import type { RootState } from '../store';

export function Settings() {
  const unit = useSelector((s: RootState) => s.settings.unit);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 shadow-sm">
      <span className="text-sm text-slate-600">Unit</span>
      <button
        type="button"
        onClick={() => dispatch(toggleUnit())}
        className="cursor-pointer rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        {unit === 'celsius' ? '°C' : '°F'}
      </button>
    </div>
  );
}
