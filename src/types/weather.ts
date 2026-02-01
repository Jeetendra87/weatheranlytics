export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  cityId: string;
  cityName: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  pressure: number;
  description: string;
  icon: string;
  visibility: number;
  dewPoint?: number;
  uvIndex?: number;
  updatedAt: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  pop: number;
  windSpeed: number;
  windDeg: number;
  weather: { icon: string; description: string }[];
}

export interface DailyForecast {
  dt: number;
  temp: { min: number; max: number };
  pop: number;
  windSpeed: number;
  windDeg: number;
  weather: { icon: string; description: string }[];
}

export interface ForecastData {
  cityId: string;
  cityName: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  updatedAt: number;
}
