import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Sidebar } from "@/components/layout/sidebar";
import { ClientCard } from "@/components/clients/client-card";
import { ClientFilterPanel } from "@/components/clients/client-filter-panel";
import { NewClientModal } from "@/components/clients/new-client-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";

export default function Clients() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    region: "",
    sort: "",
  });
  const { toast } = useToast();

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["/api/clients", searchTerm, filters],
    queryFn: async ({ queryKey }) => {
      const [_, search, filterParams] = queryKey;
      let url = "/api/clients";
      
      const params = new URLSearchParams();
      if (search) params.append("search", search as string);
      if (filterParams.type) params.append("type", (filterParams as any).type);
      if (filterParams.region) params.append("region", (filterParams as any).region);
      if (filterParams.sort) params.append("sort", (filterParams as any).sort);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return fetch(url, { credentials: "include" }).then(res => res.json());
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered by the dependency change in the query
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = async () => {
    try {
      const response = await apiRequest("GET", "/api/clients/export", undefined);
      const data = await response.json();
      
      toast({
        title: "Données exportées",
        description: "Les données ont été exportées vers Google Sheets avec succès",
      });
      
      // Si un lien de feuille est retourné, on peut l'ouvrir
      if (data.sheetUrl) {
        window.open(data.sheetUrl, "_blank");
      }
    } catch (error) {
      toast({
        title: "Erreur d'exportation",
        description: "Impossible d'exporter les données vers Google Sheets",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      <main className="flex-1 overflow-y-auto bg-background pt-0 md:pt-0 mt-16 md:mt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Gestion des Clients</h2>
              <p className="text-muted-foreground mt-1">Gérez vos clients et leurs informations</p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  className="bg-accent pl-10 pr-4 text-sm placeholder:text-muted-foreground w-64"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </form>
              
              <Button onClick={() => setIsNewClientModalOpen(true)}>
                <UserPlus className="h-5 w-5 mr-1.5" />
                Nouveau Client
              </Button>
            </div>
          </div>
          
          <ClientFilterPanel 
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-surface rounded-lg overflow-hidden shadow-sm border border-border">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="ml-3 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="p-4 border-t border-border">
                    <Skeleton className="h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
              <p className="text-destructive">Erreur lors du chargement des clients</p>
            </div>
          ) : clients && clients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          ) : (
            <div className="bg-accent rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Aucun client trouvé</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setIsNewClientModalOpen(true)}
              >
                Ajouter un client
              </Button>
            </div>
          )}
          
          {clients && clients.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{clients.length}</span> sur <span className="font-medium">{clients.length}</span> clients
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                
                <Button variant="default" size="sm" className="px-3">1</Button>
                <Button variant="outline" size="sm" className="px-3">2</Button>
                <Button variant="outline" size="sm" className="px-3">3</Button>
                
                <Button variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
          
          {isNewClientModalOpen && (
            <NewClientModal 
              isOpen={isNewClientModalOpen} 
              onClose={() => setIsNewClientModalOpen(false)} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
