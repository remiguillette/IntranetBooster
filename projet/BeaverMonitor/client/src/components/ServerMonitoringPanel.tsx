import { useState, useEffect } from 'react';
import { useServerStatus, useSystemStatus, ServerInfo, SystemStatusInfo } from "@/hooks/useServerStatus";
import { Server, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function ServerMonitoringPanel() {
  const { data: serverStatusData, isLoading: isLoadingServerStatus, isError: isServerStatusError } = useServerStatus();
  const { data: systemStatusData, isLoading: isLoadingSystemStatus, isError: isSystemStatusError } = useSystemStatus() as { data: SystemStatusInfo | undefined, isLoading: boolean, isError: boolean };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="mr-1 text-[#00C851]" />;
      case 'offline':
        return <XCircle className="mr-1 text-[#ff4444]" />;
      case 'warning':
      case 'restarting':
        return <AlertTriangle className="mr-1 text-[#ffbb33]" />;
      default:
        return <CheckCircle className="mr-1 text-[#00C851]" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'offline':
        return 'Hors ligne';
      case 'warning':
        return 'Chargé';
      case 'restarting':
        return 'Redémarrage';
      default:
        return 'En ligne';
    }
  };

  const getTextColorClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-[#00C851]';
      case 'offline':
        return 'text-[#ff4444]';
      case 'warning':
      case 'restarting':
        return 'text-[#ffbb33]';
      default:
        return 'text-[#00C851]';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days} jours, ${hours} heures, ${minutes} minutes`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `Aujourd'hui, ${hours}:${minutes}:${seconds}`;
  };

  const renderServerCard = (server: ServerInfo) => {
    const progressBarColor = 
      server.status === 'offline' 
        ? 'bg-[#ff4444]' 
        : server.cpu > 75 
          ? 'bg-[#ffbb33]' 
          : 'bg-primary';

    return (
      <div key={server.port} className="bg-[#1e1e1e] p-4 rounded-lg border border-[#333333]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Port {server.port}</span>
          <span className={`flex items-center ${getTextColorClass(server.status)}`}>
            {getStatusIcon(server.status)}
            {getStatusText(server.status)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>CPU: {server.cpu}%</span>
          <span>RAM: {server.ram}MB</span>
        </div>
        <div className="mt-2 bg-gray-700 rounded-full h-1.5">
          <div 
            className={`${progressBarColor} h-1.5 rounded-full`}
            style={{ width: `${server.status === 'offline' ? 100 : server.cpu}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderServerGrid = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (!isLoadingServerStatus && serverStatusData && Array.isArray(serverStatusData)) {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => 
            (prevIndex + 4) >= serverStatusData.length ? 0 : prevIndex + 4
          );
        }, 15000);

        return () => clearInterval(interval);
      }
    }, [isLoadingServerStatus, serverStatusData]);

    if (isLoadingServerStatus) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    if (isServerStatusError || !serverStatusData || !Array.isArray(serverStatusData)) {
      return <div className="text-red-500">Impossible de charger les données des serveurs.</div>;
    }

    const visibleServers = serverStatusData.slice(currentIndex, currentIndex + 4);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 min-h-[240px]">
          {visibleServers.map((server) => renderServerCard(server))}
          {Array.from({ length: Math.max(0, 4 - visibleServers.length) }).map((_, i) => (
            <div key={`placeholder-${i}`} className="bg-[#1e1e1e] p-4 rounded-lg border border-[#333333] opacity-0" />
          ))}
        </div>
        <div className="flex justify-center space-x-1">
          {Array.from({ length: Math.ceil((serverStatusData?.length || 0) / 4) }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-4 rounded-full transition-all ${
                Math.floor(currentIndex / 4) === i ? 'bg-primary' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderSystemStatus = () => {
    if (isLoadingSystemStatus) {
      return (
        <div className="bg-[#1e1e1e] mb-6 p-4 rounded-lg border border-[#333333]">
          <h3 className="text-xl font-medium mb-2">Status du système</h3>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      );
    }

    if (isSystemStatusError || !systemStatusData) {
      return (
        <div className="bg-[#1e1e1e] mb-6 p-4 rounded-lg border border-[#333333]">
          <h3 className="text-xl font-medium mb-2">Status du système</h3>
          <div className="text-red-500">Impossible de charger les données du système.</div>
        </div>
      );
    }

    const { cpuAverage, ramAverage, ramTotal, uptime, lastUpdated } = systemStatusData;
    const ramPercentage = (ramAverage / ramTotal) * 100;

    return (
      <div className="bg-[#1e1e1e] mb-6 p-4 rounded-lg border border-[#333333]">
        <h3 className="text-xl font-medium mb-2">Status du système</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Utilisation moyenne CPU</span>
            <span className="font-medium">{cpuAverage.toFixed(1)}%</span>
          </div>
          <Progress value={cpuAverage} className="h-2 bg-gray-700" />

          <div className="flex justify-between items-center mt-4">
            <span>Utilisation moyenne RAM</span>
            <span className="font-medium">{ramAverage}MB / {ramTotal}MB</span>
          </div>
          <Progress value={ramPercentage} className="h-2 bg-gray-700" />

          <div className="flex justify-between items-center mt-4">
            <span>Temps de fonctionnement</span>
            <span className="font-medium">{formatUptime(uptime)}</span>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span>Dernière mise à jour</span>
            <span className="font-medium">{formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1e1e1e] m-0 p-30 flex flex-col gap-2 border border-[#333333] rounded-lg overflow-y-auto" style={{ border: '1.111px solid #333333', padding: '16px' }}>
      <h2 className="text-2xl text-white font-bold flex items-center">
        <Server className="text-primary mr-2" />
        Status Serveur
      </h2>

      {renderServerGrid()}
      {renderSystemStatus()}
    </div>
  );
}