import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientDetailModal } from "./client-detail-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Client } from "@shared/schema";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await apiRequest("DELETE", `/api/clients/${client.id}`, undefined);
        queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le client",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <Card className="hover:border-primary transition-colors">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {getInitials(client.nom_complet)}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-foreground">{client.nom_complet}</h3>
                <p className="text-xs text-muted-foreground">ID: CLI-{client.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="p-1.5 text-muted-foreground hover:text-primary rounded-full hover:bg-accent">
                <Edit className="h-5 w-5" />
              </button>
              <button 
                className="p-1.5 text-muted-foreground hover:text-destructive rounded-full hover:bg-accent"
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                <p className="text-sm text-foreground">{client.telephone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm text-foreground truncate">{client.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date de naissance</p>
                <p className="text-sm text-foreground">{client.date_naissance}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type de permis</p>
                <p className="text-sm text-foreground">{client.permis?.type || "N/A"}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Adresse</p>
              <p className="text-sm text-foreground">{client.adresse}</p>
            </div>
            
            {client.vehicule && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-1">Véhicule</p>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="px-2 py-1 bg-accent rounded text-xs text-foreground">{client.vehicule.marque}</span>
                  <span className="px-2 py-1 bg-accent rounded text-xs text-foreground">{client.vehicule.modele}</span>
                  <span className="px-2 py-1 bg-accent rounded text-xs text-foreground">{client.vehicule.annee}</span>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex flex-wrap gap-2">
              {client.permis?.date_expiration && new Date(client.permis.date_expiration) > new Date() ? (
                <Badge variant="success">Permis valide</Badge>
              ) : (
                <Badge variant="destructive">Permis expiré</Badge>
              )}
              
              {client.documents_complets && (
                <Badge variant="secondary">Documents complets</Badge>
              )}
              
              {client.renouvellement_proche && (
                <Badge variant="warning">Renouvellement proche</Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full py-2 hover:bg-primary/10 text-primary"
            onClick={() => setIsDetailModalOpen(true)}
          >
            Voir les détails
          </Button>
        </CardFooter>
      </Card>
      
      {isDetailModalOpen && (
        <ClientDetailModal 
          client={client} 
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </>
  );
}
