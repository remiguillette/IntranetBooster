import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle, 
  CloudLightning, 
  CloudFog, 
  Sun, 
  CloudSun, 
  Wind,
  Droplet,
  Umbrella,
  Thermometer
} from 'lucide-react';

export type WeatherCode = 
  | 0 // Clear sky
  | 1 | 2 | 3 // Mainly clear, partly cloudy, and overcast
  | 45 | 48 // Fog and depositing rime fog
  | 51 | 53 | 55 // Drizzle: Light, moderate, and dense intensity
  | 56 | 57 // Freezing Drizzle: Light and dense intensity
  | 61 | 63 | 65 // Rain: Slight, moderate and heavy intensity
  | 66 | 67 // Freezing Rain: Light and heavy intensity
  | 71 | 73 | 75 // Snow fall: Slight, moderate, and heavy intensity
  | 77 // Snow grains
  | 80 | 81 | 82 // Rain showers: Slight, moderate, and violent
  | 85 | 86 // Snow showers slight and heavy
  | 95 // Thunderstorm: Slight or moderate
  | 96 | 99; // Thunderstorm with slight and heavy hail

export const getWeatherIcon = (code: WeatherCode) => {
  const baseClassName = "weather-icon text-primary w-16 h-16 absolute";

  switch (code) {
    case 0:
      return <Sun className={`${baseClassName} sun-shine`} />;
    case 1:
    case 2:
      return <CloudSun className={`${baseClassName} sun-shine`} />;
    case 3:
      return <Cloud className={`${baseClassName} cloud-drift`} />;
    case 45:
    case 48:
      return <CloudFog className={`${baseClassName} cloud-fog`} />;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <CloudDrizzle className={`${baseClassName} cloud-rain`} />;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return <CloudRain className={`${baseClassName} cloud-rain`} />;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return <CloudSnow className={`${baseClassName} cloud-snow`} />;
    case 95:
    case 96:
    case 99:
      return <CloudLightning className={`${baseClassName} cloud-lightning`} />;
    default:
      return <Cloud className={`${baseClassName} cloud-drift`} />;
  }
};

// Weather condition related icons
export const HumidityIcon = () => <Droplet className="text-primary mr-2" />;
export const WindIcon = () => <Wind className="text-primary mr-2" />;
export const PrecipitationIcon = () => <Umbrella className="text-primary mr-2" />;
export const TemperatureIcon = () => <Thermometer className="text-primary mr-2" />;

// Map day abbreviations to French
export const getDayAbbreviation = (day: number): string => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[day];
};
