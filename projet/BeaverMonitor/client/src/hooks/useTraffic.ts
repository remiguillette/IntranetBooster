import { useQuery } from '@tanstack/react-query';

export interface TrafficIncident {
  id: number;
  location: string;
  description: string;
  type: 'accident' | 'construction' | 'congestion' | 'info';
  severity: 'danger' | 'warning' | 'success';
}

export interface TrafficData {
  region: string;
  incidents: TrafficIncident[];
}

export function useTraffic(region: string) {
  return useQuery<TrafficData>({
    queryKey: [`/api/traffic/${encodeURIComponent(region)}`],
    refetchInterval: 300000, // 5 minutes
  });
}

export function useAllRegionsTraffic() {
  const gtaTorontoTraffic = useTraffic('GTA Toronto');
  const torontoTraffic = useTraffic('Toronto');
  const hamiltonTraffic = useTraffic('Hamilton');
  const niagaraRegionTraffic = useTraffic('Niagara Region');

  return {
    'GTA Toronto': gtaTorontoTraffic.data,
    'Toronto': torontoTraffic.data,
    'Hamilton': hamiltonTraffic.data,
    'Niagara Region': niagaraRegionTraffic.data,
    isLoading: gtaTorontoTraffic.isLoading || torontoTraffic.isLoading || hamiltonTraffic.isLoading || niagaraRegionTraffic.isLoading,
    isError: gtaTorontoTraffic.isError || torontoTraffic.isError || hamiltonTraffic.isError || niagaraRegionTraffic.isError,
    error: gtaTorontoTraffic.error || torontoTraffic.error || hamiltonTraffic.error || niagaraRegionTraffic.error
  };
}
