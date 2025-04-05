import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { WeatherCode } from '@/lib/weatherIcons';

export interface WeatherForecast {
  day: string;
  temperature: number;
  icon: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  wind: number;
  precipitation: number;
  icon: number;
  forecast: WeatherForecast[];
}

export function useWeather(city: string) {
  return useQuery<WeatherData>({
    queryKey: [`/api/weather/${encodeURIComponent(city)}`],
    refetchInterval: 900000, // 15 minutes
  });
}

export function useAllCitiesWeather() {
  const torontoWeather = useWeather('Toronto');
  const hamiltonWeather = useWeather('Hamilton');
  const niagaraFallsWeather = useWeather('Niagara Falls');

  return {
    Toronto: torontoWeather.data,
    Hamilton: hamiltonWeather.data,
    'Niagara Falls': niagaraFallsWeather.data,
    isLoading: torontoWeather.isLoading || hamiltonWeather.isLoading || niagaraFallsWeather.isLoading,
    isError: torontoWeather.isError || hamiltonWeather.isError || niagaraFallsWeather.isError,
    error: torontoWeather.error || hamiltonWeather.error || niagaraFallsWeather.error
  };
}
