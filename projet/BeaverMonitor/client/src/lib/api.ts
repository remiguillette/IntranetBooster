import { apiRequest } from './queryClient';

// Weather API
export async function fetchWeather(city: string) {
  return apiRequest('GET', `/api/weather/${encodeURIComponent(city)}`, undefined);
}

export async function fetchWeatherAlerts() {
  return apiRequest('GET', '/api/weather/alerts', undefined);
}

// Traffic API
export async function fetchTrafficByRegion(region: string) {
  return apiRequest('GET', `/api/traffic/${encodeURIComponent(region)}`, undefined);
}

// Server Status API
export async function fetchServerStatus() {
  return apiRequest('GET', '/api/servers/status', undefined);
}

export async function fetchSystemStatus() {
  return apiRequest('GET', '/api/system/status', undefined);
}

// Utility function to get weather icon code
export function getWeatherIconCode(weatherCode: number) {
  return weatherCode as number;
}
