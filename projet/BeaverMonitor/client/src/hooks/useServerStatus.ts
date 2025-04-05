import { useQuery } from '@tanstack/react-query';

export interface ServerInfo {
  port: number;
  status: 'online' | 'offline' | 'warning' | 'restarting';
  cpu: number;
  ram: number;
}

export interface SystemStatusInfo {
  cpuAverage: number;
  ramAverage: number;
  ramTotal: number;
  uptime: number;
  lastUpdated: string;
}

export function useServerStatus() {
  return useQuery({
    queryKey: ['/api/servers/status'],
    refetchInterval: 60000, // 1 minute
  });
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 60000, // 1 minute
  });
}
