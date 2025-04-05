import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertClientSchema } from "@shared/schema";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = insertClientSchema.extend({
  nom_complet: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  date_naissance: z.string().min(1, "La date de naissance est requise"),
  telephone: z.string().min(1, "Le numéro de téléphone est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  code_postal: z.string().min(5, "Le code postal est invalide"),
  ville: z.string().min(1, "La ville est requise"),
  type_client: z.string().default("particulier"),
  'permis.numero': z.string().optional(),
  'permis.date_emission': z.string().optional(),
  'permis.date_expiration': z.string().optional(),
  'permis.type': z.string().optional(),
  'vehicule.immatriculation': z.string().optional(),
  'vehicule.marque': z.string().optional(),
  'vehicule.modele': z.string().optional(),
  'vehicule.annee': z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewClientModal({ isOpen, onClose }: NewClientModalProps) {
  const [activeTab, setActiveTab] = useState("informations");
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom_complet: "",
      email: "",
      date_naissance: "",
      telephone: "",
      adresse: "",
      code_postal: "",
      ville: "",
      type_client: "particulier",
      'permis.numero': "",
      'permis.date_emission': "",
      'permis.date_expiration': "",
      'permis.type': "",
      'vehicule.immatriculation': "",
      'vehicule.marque': "",
      'vehicule.modele': "",
      'vehicule.annee': "",
    },
  });

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };
  
  const handleUploadComplete = (documentType: string) => (fileUrl: string) => {
    toast({
      title: "Document téléchargé",
      description: "Le document a été téléchargé avec succès",
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const clientData = {
        nom_complet: data.nom_complet,
        email: data.email,
        date_naissance: data.date_naissance,
        telephone: data.telephone,
        adresse: `${data.adresse}, ${data.code_postal} ${data.ville}`,
        type: data.type_client,
        permis: {
          numero: data["permis.numero"],
          date_emission: data["permis.date_emission"],
          date_expiration: data["permis.date_expiration"],
          type: data["permis.type"],
        },
        vehicule: {
          immatriculation: data["vehicule.immatriculation"],
          marque: data["vehicule.marque"],
          modele: data["vehicule.modele"],
          annee: data["vehicule.annee"],
        },
      };
      
      await apiRequest("POST", "/api/clients", clientData);
      
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Client ajouté",
        description: "Le client a été ajouté avec succès",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le client",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Nouveau Client</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)] p-6">
              <Tabs value={activeTab} onValueChange={handleChangeTab}>
                <TabsList className="border-b border-border w-full justify-start space-x-6 mb-6">
                  <TabsTrigger value="informations">Informations Personnelles</TabsTrigger>
                  <TabsTrigger value="permis">Permis de Conduire</TabsTrigger>
                  <TabsTrigger value="vehicule">Véhicule</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="informations" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nom_complet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom et prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date_naissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse complète" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="code_postal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder="Code postal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="ville"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input placeholder="Ville" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro de téléphone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Adresse email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="type_client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de client</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type de client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="particulier">Particulier</SelectItem>
                            <SelectItem value="entreprise">Entreprise</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="permis" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="permis.numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de permis</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro de permis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="permis.date_emission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'émission</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="permis.date_expiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expiration</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="permis.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Types de permis (séparés par des virgules)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: A, B, C" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Scan du permis</FormLabel>
                    <div className="mt-1">
                      <FileUpload
                        onUploadComplete={handleUploadComplete("permis")}
                        documentType="permis"
                        label="Télécharger le permis"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vehicule" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="vehicule.immatriculation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Immatriculation</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro d'immatriculation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="vehicule.marque"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marque</FormLabel>
                          <FormControl>
                            <Input placeholder="Marque du véhicule" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vehicule.modele"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modèle</FormLabel>
                          <FormControl>
                            <Input placeholder="Modèle du véhicule" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vehicule.annee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année</FormLabel>
                          <FormControl>
                            <Input placeholder="Année du véhicule" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Carte grise</FormLabel>
                    <div className="mt-1">
                      <FileUpload
                        onUploadComplete={handleUploadComplete("carte_grise")}
                        documentType="carte_grise"
                        label="Télécharger la carte grise"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-6">
                  <div>
                    <FormLabel>Pièce d'identité</FormLabel>
                    <div className="mt-1">
                      <FileUpload
                        onUploadComplete={handleUploadComplete("identite")}
                        documentType="identite"
                        label="Télécharger la pièce d'identité"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel>Justificatif de domicile</FormLabel>
                    <div className="mt-1">
                      <FileUpload
                        onUploadComplete={handleUploadComplete("domicile")}
                        documentType="domicile"
                        label="Télécharger le justificatif"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel>Autres documents</FormLabel>
                    <div className="mt-1">
                      <FileUpload
                        onUploadComplete={handleUploadComplete("autre")}
                        documentType="autre"
                        label="Télécharger d'autres documents"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter className="p-4 border-t border-border flex justify-between items-center">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              
              <div className="flex items-center space-x-3">
                {activeTab !== "documents" && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      const tabs = ["informations", "permis", "vehicule", "documents"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                  >
                    Suivant
                  </Button>
                )}
                <Button type="submit">
                  Enregistrer
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
