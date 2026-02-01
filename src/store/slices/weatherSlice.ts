import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as weatherApi from '../../services/weatherApi';
import type { CurrentWeather, ForecastData, City } from '../../types/weather';

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city: City) => {
    const current = await weatherApi.getCurrentWeather(
      city.lat,
      city.lon,
      city.name,
      city.country
    );
    return current;
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ city, lat, lon }: { city: City; lat?: number; lon?: number }) => {
    const la = lat ?? city.lat;
    const lo = lon ?? city.lon;
    return weatherApi.getForecast(la, lo, city.name);
  }
);

type WeatherState = {
  currentByCity: Record<string, CurrentWeather>;
  forecastByCity: Record<string, ForecastData>;
};

const initialState: WeatherState = {
  currentByCity: {},
  forecastByCity: {},
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.currentByCity[action.payload.cityId] = action.payload;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecastByCity[action.payload.cityId] = action.payload;
      });
  },
});

export default weatherSlice.reducer;
