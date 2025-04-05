import { Filter, SortDesc } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ClientFilterPanelProps {
  onFilterChange: (filters: {
    type?: string;
    region?: string;
    sort?: string;
  }) => void;
  onExport: () => void;
}

export function ClientFilterPanel({ onFilterChange, onExport }: ClientFilterPanelProps) {
  const handleTypeChange = (value: string) => {
    onFilterChange({ type: value });
  };

  const handleRegionChange = (value: string) => {
    onFilterChange({ region: value });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ sort: value });
  };
  
  return (
    <div className="bg-surface rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Select onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full md:w-auto bg-accent">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les types</SelectItem>
              <SelectItem value="particulier">Particulier</SelectItem>
              <SelectItem value="entreprise">Entreprise</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleRegionChange}>
            <SelectTrigger className="w-full md:w-auto bg-accent">
              <SelectValue placeholder="Toutes les régions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes les régions</SelectItem>
              <SelectItem value="nord">Nord</SelectItem>
              <SelectItem value="sud">Sud</SelectItem>
              <SelectItem value="est">Est</SelectItem>
              <SelectItem value="ouest">Ouest</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-auto bg-accent">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aucun">Trier par</SelectItem>
              <SelectItem value="nom_asc">Nom (A-Z)</SelectItem>
              <SelectItem value="nom_desc">Nom (Z-A)</SelectItem>
              <SelectItem value="date_asc">Date (ancien-récent)</SelectItem>
              <SelectItem value="date_desc">Date (récent-ancien)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="text-muted-foreground hover:text-primary text-sm">
            <Filter className="h-5 w-5 mr-1" />
            Filtres avancés
          </Button>
          
          <Button variant="ghost" className="text-muted-foreground hover:text-primary text-sm" onClick={onExport}>
            <SortDesc className="h-5 w-5 mr-1" />
            Exporter
          </Button>
        </div>
      </div>
    </div>
  );
}
