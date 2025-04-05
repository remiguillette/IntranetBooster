import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@shared/schema";

export function useClientQuery(clientId?: number) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: clientId ? [`/api/clients/${clientId}`] : ["/api/clients"],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Erreur lors du chargement des données",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: clientId !== undefined,
  });
}

export function useClientsQuery(options?: {
  search?: string;
  type?: string;
  region?: string;
  sort?: string;
}) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["/api/clients", options],
    queryFn: async ({ queryKey }) => {
      try {
        const [baseUrl, queryOptions] = queryKey;
        const opts = queryOptions as typeof options || {};
        
        let url = baseUrl as string;
        const params = new URLSearchParams();
        
        if (opts.search) params.append("search", opts.search);
        if (opts.type) params.append("type", opts.type);
        if (opts.region) params.append("region", opts.region);
        if (opts.sort) params.append("sort", opts.sort);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        return await response.json() as Client[];
      } catch (error) {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Erreur lors du chargement des clients",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
}
