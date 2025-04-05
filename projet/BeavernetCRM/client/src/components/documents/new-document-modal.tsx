import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewDocumentModal({ isOpen, onClose }: NewDocumentModalProps) {
  const [documentType, setDocumentType] = useState("");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer la liste des clients
  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: async () => {
      return fetch("/api/clients")
        .then((res) => {
          if (!res.ok) throw new Error("Erreur lors du chargement des clients");
          return res.json();
        })
        .catch(() => []);
    },
  });

  // Mutation pour ajouter un document
  const addDocumentMutation = useMutation({
    mutationFn: async (documentData: any) => {
      return apiRequest({
        url: "/api/documents",
        method: "POST",
        data: documentData,
        on401: "throw",
      });
    },
    onSuccess: () => {
      toast({
        title: "Document ajouté",
        description: "Le document a été ajouté avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'ajout de document:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue lors de l'ajout du document",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentType || !clientId || !fileUrl) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    addDocumentMutation.mutate({
      type: documentType,
      client_id: Number(clientId),
      description,
      document_url: fileUrl,
      date: new Date().toISOString(),
      status: "a_verifier",
    });
  };

  const handleUploadComplete = (url: string) => {
    setFileUrl(url);
    toast({
      title: "Fichier téléchargé",
      description: "Le fichier a été téléchargé avec succès",
    });
  };

  const resetForm = () => {
    setDocumentType("");
    setClientId("");
    setDescription("");
    setFileUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Type de document *</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permis">Permis de conduire</SelectItem>
                    <SelectItem value="carte_grise">Carte grise</SelectItem>
                    <SelectItem value="identite">Pièce d'identité</SelectItem>
                    <SelectItem value="domicile">Justificatif de domicile</SelectItem>
                    <SelectItem value="autre">Autre document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client associé *</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.nom_complet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description du document"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-20"
                />
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-accent/50 border border-dashed border-border rounded-lg p-6">
              {fileUrl ? (
                <div className="text-center space-y-2">
                  <div className="bg-primary/20 rounded-full p-2 inline-flex">
                    <UploadCloud className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm">Fichier téléchargé avec succès</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFileUrl("")}
                  >
                    Changer de fichier
                  </Button>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Glissez-déposez votre fichier ici ou cliquez pour parcourir
                  </p>
                  <FileUpload
                    onUploadComplete={handleUploadComplete}
                    documentType={documentType || "autre"}
                    clientId={clientId ? parseInt(clientId) : undefined}
                    label="Télécharger un document"
                  />
                </>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={addDocumentMutation.isPending}>
              {addDocumentMutation.isPending ? "Ajout en cours..." : "Ajouter le document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}