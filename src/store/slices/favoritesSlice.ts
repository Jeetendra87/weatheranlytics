import { createSlice } from '@reduxjs/toolkit';
import type { City } from '../../types/weather';
const STORAGE_KEY = 'weather-favorites';

const loadFavorites = (): City[] => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s) as City[];
  } catch {}
  return [];
};

const saveFavorites = (cities: City[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {}
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { list: loadFavorites() as City[] },
  reducers: {
    addFavorite(state, action: { payload: City }) {
      const id = action.payload.id;
      if (!state.list.some((c) => c.id === id)) {
        state.list.push(action.payload);
        saveFavorites(state.list);
      }
    },
    removeFavorite(state, action: { payload: string }) {
      state.list = state.list.filter((c) => c.id !== action.payload);
      saveFavorites(state.list);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
