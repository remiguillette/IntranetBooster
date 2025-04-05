import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface WeatherAlert {
  id: number;
  type: 'danger' | 'warning' | 'success';
  message: string;
  region: string;
  timestamp: string;
  active: boolean;
}

export function useWeatherAlerts() {
  const [currentAlert, setCurrentAlert] = useState<WeatherAlert | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const alertsQuery = useQuery({
    queryKey: ['/api/weather/alerts'],
    refetchInterval: 300000, // 5 minutes
  });

  // Process alerts when data changes
  useEffect(() => {
    if (alertsQuery.data && Array.isArray(alertsQuery.data)) {
      const activeAlerts = alertsQuery.data.filter(alert => alert.active);
      
      if (activeAlerts.length > 0) {
        // Show the most recent alert
        const mostRecentAlert = activeAlerts.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        setCurrentAlert(mostRecentAlert);
        setShowAlert(true);
      } else {
        setCurrentAlert(null);
        setShowAlert(false);
      }
    }
  }, [alertsQuery.data]);

  const closeAlert = () => {
    setShowAlert(false);
  };

  return {
    currentAlert,
    showAlert,
    closeAlert,
    isLoading: alertsQuery.isLoading,
    isError: alertsQuery.isError,
    error: alertsQuery.error
  };
}
