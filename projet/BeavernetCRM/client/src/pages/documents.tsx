import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";
import { Search, Eye, Download, AlertCircle, CheckCircle, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewDocumentModal } from "@/components/documents/new-document-modal";

export default function Documents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tous");
  const [isNewDocumentModalOpen, setIsNewDocumentModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents", searchTerm, activeTab],
    queryFn: async ({ queryKey }) => {
      const [_, search, tab] = queryKey;
      let url = "/api/documents";
      
      const params = new URLSearchParams();
      if (search) params.append("search", search as string);
      if (tab && tab !== "tous") params.append("type", tab as string);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return fetch(url, { credentials: "include" })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors du chargement des documents");
          return res.json();
        })
        .catch(() => {
          // Retourner des données factices pour la démonstration
          return [
            { id: 1, nom: "Permis de conduire - Martin Dubois", type: "permis", client: "Martin Dubois", date: "15/08/2023", status: "valide" },
            { id: 2, nom: "Carte grise - Sophie Leroy", type: "carte_grise", client: "Sophie Leroy", date: "12/08/2023", status: "valide" },
            { id: 3, nom: "Permis de conduire - Pierre Girard", type: "permis", client: "Pierre Girard", date: "10/08/2023", status: "expire" },
            { id: 4, nom: "Pièce d'identité - Jean Dupont", type: "identite", client: "Jean Dupont", date: "05/08/2023", status: "valide" },
            { id: 5, nom: "Justificatif de domicile - Marie Lambert", type: "domicile", client: "Marie Lambert", date: "01/08/2023", status: "valide" },
            { id: 6, nom: "Permis de conduire - Anne Clerc", type: "permis", client: "Anne Clerc", date: "28/07/2023", status: "a_verifier" },
          ];
        });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche sera déclenchée par le changement de dépendance dans la requête
  };

  const handleUploadComplete = (fileUrl: string) => {
    toast({
      title: "Document téléchargé",
      description: "Le document a été téléchargé avec succès",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valide":
        return (
          <div className="flex items-center text-success">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Valide</span>
          </div>
        );
      case "expire":
        return (
          <div className="flex items-center text-destructive">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Expiré</span>
          </div>
        );
      case "a_verifier":
        return (
          <div className="flex items-center text-warning">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>À vérifier</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Inconnu</span>
          </div>
        );
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types = {
      permis: "Permis de conduire",
      carte_grise: "Carte grise",
      identite: "Pièce d'identité",
      domicile: "Justificatif de domicile",
      autre: "Autre document"
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      <main className="flex-1 overflow-y-auto bg-background pt-0 md:pt-0 mt-16 md:mt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Gestion des Documents</h2>
              <p className="text-muted-foreground mt-1">Gérez tous les documents de vos clients</p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  className="bg-accent pl-10 pr-4 text-sm placeholder:text-muted-foreground w-64"
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </form>
              
              <Button onClick={() => setIsNewDocumentModalOpen(true)}>
                <UploadCloud className="h-5 w-5 mr-1.5" />
                Nouveau Document
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-accent">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="permis">Permis</TabsTrigger>
              <TabsTrigger value="carte_grise">Cartes grises</TabsTrigger>
              <TabsTrigger value="identite">Pièces d'identité</TabsTrigger>
              <TabsTrigger value="domicile">Justificatifs</TabsTrigger>
              <TabsTrigger value="autre">Autres</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tous" className="mt-4">
              <DocumentList documents={documents} isLoading={isLoading} getStatusBadge={getStatusBadge} getDocumentTypeLabel={getDocumentTypeLabel} />
            </TabsContent>
            
            <TabsContent value="permis" className="mt-4">
              <DocumentList 
                documents={documents?.filter(doc => doc.type === "permis")} 
                isLoading={isLoading} 
                getStatusBadge={getStatusBadge}
                getDocumentTypeLabel={getDocumentTypeLabel}
              />
            </TabsContent>
            
            <TabsContent value="carte_grise" className="mt-4">
              <DocumentList 
                documents={documents?.filter(doc => doc.type === "carte_grise")} 
                isLoading={isLoading} 
                getStatusBadge={getStatusBadge}
                getDocumentTypeLabel={getDocumentTypeLabel}
              />
            </TabsContent>
            
            <TabsContent value="identite" className="mt-4">
              <DocumentList 
                documents={documents?.filter(doc => doc.type === "identite")} 
                isLoading={isLoading} 
                getStatusBadge={getStatusBadge}
                getDocumentTypeLabel={getDocumentTypeLabel}
              />
            </TabsContent>
            
            <TabsContent value="domicile" className="mt-4">
              <DocumentList 
                documents={documents?.filter(doc => doc.type === "domicile")} 
                isLoading={isLoading} 
                getStatusBadge={getStatusBadge}
                getDocumentTypeLabel={getDocumentTypeLabel}
              />
            </TabsContent>
            
            <TabsContent value="autre" className="mt-4">
              <DocumentList 
                documents={documents?.filter(doc => doc.type === "autre")} 
                isLoading={isLoading} 
                getStatusBadge={getStatusBadge}
                getDocumentTypeLabel={getDocumentTypeLabel}
              />
            </TabsContent>
          </Tabs>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Télécharger un nouveau document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type de document</label>
                      <select className="w-full bg-accent border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="">Sélectionner un type</option>
                        <option value="permis">Permis de conduire</option>
                        <option value="carte_grise">Carte grise</option>
                        <option value="identite">Pièce d'identité</option>
                        <option value="domicile">Justificatif de domicile</option>
                        <option value="autre">Autre document</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Client associé</label>
                      <select className="w-full bg-accent border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="">Sélectionner un client</option>
                        <option value="1">Martin Dubois</option>
                        <option value="2">Sophie Leroy</option>
                        <option value="3">Pierre Girard</option>
                        <option value="4">Jean Dupont</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea className="w-full bg-accent border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" rows={3}></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-center bg-accent/50 border border-dashed border-border rounded-lg p-8">
                  <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Glissez-déposez votre fichier ici ou cliquez pour parcourir
                  </p>
                  <FileUpload
                    onUploadComplete={handleUploadComplete}
                    documentType="autre"
                    label="Télécharger un document"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Enregistrer le document</Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <NewDocumentModal 
        isOpen={isNewDocumentModalOpen} 
        onClose={() => setIsNewDocumentModalOpen(false)} 
      />
    </div>
  );
}

interface DocumentListProps {
  documents?: any[];
  isLoading: boolean;
  getStatusBadge: (status: string) => JSX.Element;
  getDocumentTypeLabel: (type: string) => string;
}

function DocumentList({ documents, isLoading, getStatusBadge, getDocumentTypeLabel }: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Chargement des documents...</p>
      </div>
    );
  }
  
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center p-8 bg-accent rounded-lg">
        <p className="text-muted-foreground">Aucun document trouvé</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nom du document</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Statut</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-border hover:bg-accent/50">
              <td className="py-3 px-4">{doc.nom}</td>
              <td className="py-3 px-4">{getDocumentTypeLabel(doc.type)}</td>
              <td className="py-3 px-4">{doc.client}</td>
              <td className="py-3 px-4">{doc.date}</td>
              <td className="py-3 px-4">{getStatusBadge(doc.status)}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Voir</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Télécharger</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
