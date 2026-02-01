import { createSlice } from '@reduxjs/toolkit';

type Unit = 'celsius' | 'fahrenheit';

const loadUnit = (): Unit => {
  try {
    const s = localStorage.getItem('weather-unit');
    if (s === 'fahrenheit' || s === 'celsius') return s;
  } catch {}
  return 'celsius';
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { unit: loadUnit() as Unit },
  reducers: {
    toggleUnit(state) {
      state.unit = state.unit === 'celsius' ? 'fahrenheit' : 'celsius';
      try {
        localStorage.setItem('weather-unit', state.unit);
      } catch {}
    },
  },
});

export const { toggleUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
