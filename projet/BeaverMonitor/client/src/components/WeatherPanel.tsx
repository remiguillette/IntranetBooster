import { useAllCitiesWeather, WeatherData } from "@/hooks/useWeather";
import { getWeatherIcon, HumidityIcon, WindIcon, PrecipitationIcon, WeatherCode } from "@/lib/weatherIcons";
import { Cloud } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeatherPanel() {
  const { Toronto, Hamilton, "Niagara Falls": NiagaraFalls, isLoading, isError } = useAllCitiesWeather();

  const renderWeatherCard = (data: WeatherData | undefined, city: string) => {
    if (isLoading) {
      return (
        <div className="bg-[#1e1e1e] mb-6 p-5 rounded-lg border border-[#333333]">
          <h3 className="text-2xl font-medium mb-2">{city}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-16 w-16 rounded-full mr-2" />
              <Skeleton className="h-10 w-20" />
            </div>
            <div>
              <Skeleton className="h-6 w-24 mb-1" />
              <Skeleton className="h-6 w-24 mb-1" />
              <Skeleton className="h-6 w-24 mb-1" />
            </div>
          </div>
        </div>
      );
    }

    if (isError || !data) {
      return (
        <div className="bg-[#1e1e1e] mb-6 p-5 rounded-lg border border-[#333333]">
          <h3 className="text-2xl font-medium mb-2">{city}</h3>
          <div className="text-red-500">Impossible de charger les données météo.</div>
        </div>
      );
    }

    return (
      <div className="bg-[#1e1e1e] mb-6 p-5 rounded-lg border border-[#333333]">
        <h3 className="text-2xl font-medium mb-2">{city}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="weather-icon-container overflow-hidden w-16 h-16 relative mr-2">
              {getWeatherIcon(data.icon as WeatherCode)}
            </div>
            <div className="text-4xl font-bold">{data.temperature}°C</div>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <HumidityIcon />
              <span>{data.humidity}%</span>
            </div>
            <div className="flex items-center mb-1">
              <WindIcon />
              <span>{data.wind} km/h</span>
            </div>
            <div className="flex items-center mb-1">
              <PrecipitationIcon />
              <span>{data.precipitation}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1e1e1e] p-4 flex flex-col overflow-y-auto border border-[#333333] rounded-lg">
      <h2 className="text-2xl text-white font-bold mb-3 flex items-center">
        <Cloud className="text-primary mr-2" />
        Météo
      </h2>
      
      {renderWeatherCard(Toronto as WeatherData, "Toronto")}
      {renderWeatherCard(Hamilton as WeatherData, "Hamilton")}
      {renderWeatherCard(NiagaraFalls as WeatherData, "Niagara Falls")}
    </div>
  );
}
