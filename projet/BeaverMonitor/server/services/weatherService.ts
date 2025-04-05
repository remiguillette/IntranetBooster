import axios from 'axios';
import { storage } from '../storage';
import { WeatherData, InsertWeatherData, WeatherAlert, InsertWeatherAlert } from '@shared/schema';

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relativehumidity_2m: number[];
    precipitation_probability: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface CityCoordinates {
  [key: string]: { latitude: number; longitude: number };
}

const cityCoordinates: CityCoordinates = {
  'Toronto': { latitude: 43.6532, longitude: -79.3832 },
  'Hamilton': { latitude: 43.2557, longitude: -79.8711 },
  'Niagara Falls': { latitude: 43.0896, longitude: -79.0849 }
};

// Function to get the day of the week in French
function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[date.getDay()];
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  if (!cityCoordinates[city]) {
    throw new Error(`Coordonnées non disponibles pour la ville: ${city}`);
  }
  
  const { latitude, longitude } = cityCoordinates[city];
  
  const response = await axios.get<OpenMeteoResponse>('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude,
      longitude,
      current_weather: true,
      hourly: 'temperature_2m,relativehumidity_2m,precipitation_probability,weathercode',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      timezone: 'America/Toronto',
      forecast_days: 6
    }
  });

  const data = response.data;
  
  // Get current weather data
  const currentWeather = data.current_weather;
  const currentHour = new Date().getHours();
  
  // Find current hour index in the hourly data
  const currentHourIndex = data.hourly.time.findIndex(time => 
    new Date(time).getHours() === currentHour
  );
  
  // Get humidity and precipitation probability for current hour
  const humidity = currentHourIndex !== -1 
    ? Math.round(data.hourly.relativehumidity_2m[currentHourIndex])
    : 0;
  
  const precipitation = currentHourIndex !== -1 
    ? Math.round(data.hourly.precipitation_probability[currentHourIndex]) 
    : 0;
  
  // Prepare the forecast data
  const forecast = data.daily.time.slice(1, 6).map((date, index) => ({
    day: getDayOfWeek(date),
    temperature: Math.round(data.daily.temperature_2m_max[index + 1]),
    icon: data.daily.weathercode[index + 1]
  }));
  
  const weatherData: WeatherData = {
    id: 0, // Will be assigned by storage
    city,
    temperature: Math.round(currentWeather.temperature),
    humidity,
    wind: Math.round(currentWeather.windspeed),
    precipitation,
    icon: currentWeather.weathercode,
    forecast: JSON.stringify(forecast),
    timestamp: new Date().toISOString()
  };
  
  // Store the weather data
  await storage.saveWeatherData(weatherData);
  
  // Return the data with parsed forecast
  return {
    ...weatherData,
    forecast: forecast
  } as unknown as WeatherData;
}

export async function checkWeatherAlerts(city: string, weatherData: OpenMeteoResponse): Promise<void> {
  // Check for extreme weather conditions
  const currentWeatherCode = weatherData.current_weather.weathercode;
  const currentTemp = weatherData.current_weather.temperature;
  
  // Check temperature extremes
  if (currentTemp > 30) {
    const alert: InsertWeatherAlert = {
      type: 'warning',
      message: `Alerte Météo: Chaleur extrême pour ${city} (${currentTemp}°C)`,
      region: city,
      active: true
    };
    await storage.createWeatherAlert(alert);
  }
  
  // Check for severe weather conditions
  if ([95, 96, 99].includes(currentWeatherCode)) {
    const alert: InsertWeatherAlert = {
      type: 'danger',
      message: `Alerte Météo: Orage violent prévu pour ${city}`,
      region: city,
      active: true
    };
    await storage.createWeatherAlert(alert);
  }
  
  // Check for heavy rain
  if ([61, 63, 65, 80, 81, 82].includes(currentWeatherCode)) {
    const alert: InsertWeatherAlert = {
      type: 'warning',
      message: `Alerte Météo: Fortes pluies prévues pour ${city}`,
      region: city,
      active: true
    };
    await storage.createWeatherAlert(alert);
  }
  
  // Check for snow
  if ([71, 73, 75, 77, 85, 86].includes(currentWeatherCode)) {
    const alert: InsertWeatherAlert = {
      type: 'warning',
      message: `Alerte Météo: Chutes de neige prévues pour ${city}`,
      region: city,
      active: true
    };
    await storage.createWeatherAlert(alert);
  }
}
