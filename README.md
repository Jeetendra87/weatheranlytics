# Weather Analytics Dashboard

A simple web app to view current weather, forecasts, and charts for your favorite cities. Built with React, Tailwind CSS, Redux Toolkit, and Recharts.

## Features

- **Dashboard** – Default cities (London, New York, Tokyo, Paris, New Delhi) on first load; summary cards with temp, condition, humidity, wind
- **Detail view** – 5–7 day forecast, 3-hour steps, pressure, visibility, charts
- **Search & Favorites** – Search cities (OpenWeatherMap Geocoding), pin favorites (saved in localStorage)
- **Charts** – Temperature trend, precipitation chance, wind speed (Recharts)
- **Settings** – Toggle °C / °F (persisted)
- **Caching** – API responses cached for 60 seconds to limit calls and keep data fresh
 - **Real-time Data** – Implements automatic data refresh to ensure all fetched data is no older than 60 seconds.

- **Auth (Auth0 + Google)** – Log in / Sign up and Profile page; Log out in header

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **API key**

   - Create a file named **`.env`** in the project root (Vite does **not** read `.env.example`).
   - The variable **must** be named **`VITE_OPENWEATHER_API_KEY`** (Vite only exposes env vars that start with `VITE_`).
   - No quotes, no spaces. Example line in `.env`:

   ```bash
   VITE_OPENWEATHER_API_KEY=your_32_char_key_here
   ```

   - Free key: [Sign up](https://home.openweathermap.org/users/sign_up) → verify email → [API keys](https://home.openweathermap.org/api_keys). **New keys can take up to 2 hours to activate.**
   - After changing `.env`, restart the dev server (`npm run dev`).

3. **Auth0 (optional – for login/profile)**

   - Create a free app at [Auth0](https://auth0.com). Add **Single Page Application**, set **Allowed Callback URLs** to `http://localhost:5173` (and your production URL later).
   - In Auth0 Dashboard → Applications → your app: copy **Domain** and **Client ID**.
   - Enable **Google** in Authentication → Social: add your Google OAuth client ID/secret.
   - In `.env` add:
   ```bash
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your_client_id
   ```
   - If these are missing, the app still runs; login/profile will not work until they are set.

4. **Run**

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (e.g. http://localhost:5173).

## Tech stack

- **React 19** (with hooks)
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Redux Toolkit** – weather data, favorites, unit preference
- **React Router** – `/` (dashboard), `/city/:cityId` (detail), `/profile` (login/signup, user info)
- **Auth0 React** – Google (and other) login, profile, logout
- **Recharts** – line/bar charts
- **OpenWeatherMap** – current weather, 5-day forecast, geocoding

## Project structure

```
src/
  components/   # SearchBar, CityCard, WeatherIcon, Settings, Charts, HeaderAuth
  pages/        # Dashboard, CityDetail, Profile
  store/        # Redux store + slices (weather, favorites, settings)
  services/     # weatherApi (with 60s cache)
  types/        # weather types
  utils/        # unit conversion
```

This is a demo/internship-style project: straightforward structure, optional Auth0 + Google login.
