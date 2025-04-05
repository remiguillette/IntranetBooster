import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import AlertBanner from '@/components/AlertBanner';
import WeatherPanel from '@/components/WeatherPanel';
import TrafficPanel from '@/components/TrafficPanel';
import ServerMonitoringPanel from '@/components/ServerMonitoringPanel';
import VideoPlayerPanel from '@/components/VideoPlayerPanel';
import { useWeatherAlerts } from '@/hooks/useWeatherAlerts';

export default function Dashboard() {
  const { currentAlert, showAlert, closeAlert } = useWeatherAlerts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentAlert && (
        <AlertBanner
          type={currentAlert.type}
          message={currentAlert.message}
          isVisible={showAlert}
          onClose={closeAlert}
        />
      )}

      <Header />

      <main className="px-8 py-4 grid grid-cols-12 gap-6" style={{ height: 'calc(100vh - 8rem)' }}>
        {/* Weather panel - 1/3 width (4 columns) */}
        <div className="col-span-4">
          <WeatherPanel />
        </div>

        {/* Traffic and Video panels - 1/3 width, stacked vertically (4 columns) */}
        <div className="col-span-4 grid grid-rows-[1fr_1fr] gap-2">
          <TrafficPanel />
          <div className="w-full h-full">
            <VideoPlayerPanel />
          </div>
        </div>

        {/* Server monitoring panel - 1/3 width (4 columns) */}
        <div className="col-span-4">
          <ServerMonitoringPanel />
        </div>
      </main>
    </div>
  );
}