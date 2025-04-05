import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  User, 
  FileText, 
  Car, 
  MessageSquare, 
  Phone,
  Mail,
  Edit,
  Trash2,
  X
} from "lucide-react";
import type { Client } from "@shared/schema";

interface ClientDetailModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailModal({ client, isOpen, onClose }: ClientDetailModalProps) {
  const [activeTab, setActiveTab] = useState("informations");
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await apiRequest("POST", `/api/clients/${client.id}/notes`, {
        contenu: newNote,
      });

      queryClient.invalidateQueries({ queryKey: [`/api/clients/${client.id}`] });
      setNewNote("");
      toast({
        title: "Note ajoutée",
        description: "La note a été ajoutée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive",
      });
    }
  };

  const handleUploadComplete = (documentType: string) => (fileUrl: string) => {
    toast({
      title: "Document téléchargé",
      description: "Le document a été téléchargé avec succès",
    });
    queryClient.invalidateQueries({ queryKey: [`/api/clients/${client.id}`] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Détails du Client</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Left Column */}
              <div className="w-full md:w-1/3">
                <div className="p-4 rounded-lg"> {/* Removed bg-accent */}
                  <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold text-foreground">{client.nom_complet}</h4> {/* Removed avatar div */}
                    <p className="text-sm text-muted-foreground">ID: CLI-{client.id}</p>

                    <div className="mt-4 w-full">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Type de client</span>
                        <span className="text-sm font-medium text-foreground">{client.type || 'Particulier'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Date d'inscription</span>
                        <span className="text-sm font-medium text-foreground">{client.date_inscription || '12/03/2023'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Dernière visite</span>
                        <span className="text-sm font-medium text-foreground">{client.derniere_visite || '28/08/2023'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Statut</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col space-y-2">
                    <Button className="w-full flex items-center justify-center gap-2">
                      <Edit className="h-5 w-5" />
                      Modifier
                    </Button>
                    <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-2/3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="border-b border-border w-full justify-start space-x-6">
                    <TabsTrigger value="informations">Informations</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="historique">Historique</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="informations" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Info */}
                      <div className="p-4 rounded-lg"> {/*Removed bg-accent*/}
                        <h5 className="font-medium text-foreground mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2 text-primary" />
                          Informations Personnelles
                        </h5>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Nom complet</p>
                            <p className="text-sm text-foreground">{client.nom_complet}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Date de naissance</p>
                            <p className="text-sm text-foreground">{client.date_naissance}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Adresse</p>
                            <p className="text-sm text-foreground">{client.adresse}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                            <p className="text-sm text-foreground">{client.telephone}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Email</p>
                            <p className="text-sm text-foreground">{client.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* License Info */}
                      <div className="p-4 rounded-lg"> {/*Removed bg-accent*/}
                        <h5 className="font-medium text-foreground mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          Permis de Conduire
                        </h5>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Numéro de permis</p>
                            <p className="text-sm text-foreground">{client.permis?.numero || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Date d'émission</p>
                            <p className="text-sm text-foreground">{client.permis?.date_emission || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Date d'expiration</p>
                            <p className="text-sm text-foreground">{client.permis?.date_expiration || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Catégories</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {client.permis?.type.split(',').map((type, index) => (
                                <span key={index} className="px-2 py-1 bg-primary/20 rounded text-xs text-primary">
                                  {type.trim()}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Scan du permis</p>
                            {client.permis?.document_url ? (
                              <div className="mt-1 flex items-center">
                                <span className="ml-2 text-xs text-muted-foreground">permis_{client.id}.jpg</span>
                                <Button variant="link" size="sm" className="ml-2 text-primary text-xs p-0">
                                  Voir
                                </Button>
                              </div>
                            ) : (
                              <FileUpload
                                onUploadComplete={handleUploadComplete("permis")}
                                clientId={client.id}
                                documentType="permis"
                                label="Télécharger un scan"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div className="p-4 rounded-lg"> {/*Removed bg-accent*/}
                        <h5 className="font-medium text-foreground mb-4 flex items-center">
                          <Car className="h-5 w-5 mr-2 text-primary" />
                          Véhicule
                        </h5>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Immatriculation</p>
                            <p className="text-sm text-foreground">{client.vehicule?.immatriculation || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Marque</p>
                            <p className="text-sm text-foreground">{client.vehicule?.marque || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Modèle</p>
                            <p className="text-sm text-foreground">{client.vehicule?.modele || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Année</p>
                            <p className="text-sm text-foreground">{client.vehicule?.annee || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Certificat d'immatriculation</p>
                            {client.vehicule?.document_url ? (
                              <div className="mt-1 flex items-center">
                                <span className="ml-2 text-xs text-muted-foreground">carte_grise_{client.id}.jpg</span>
                                <Button variant="link" size="sm" className="ml-2 text-primary text-xs p-0">
                                  Voir
                                </Button>
                              </div>
                            ) : (
                              <FileUpload
                                onUploadComplete={handleUploadComplete("carte_grise")}
                                clientId={client.id}
                                documentType="carte_grise"
                                label="Télécharger un scan"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact History */}
                      <div className="p-4 rounded-lg"> {/*Removed bg-accent*/}
                        <h5 className="font-medium text-foreground mb-4 flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                          Contacts Récents
                        </h5>

                        <div className="space-y-4">
                          {client.interactions && client.interactions.length > 0 ? (
                            client.interactions.map((interaction, index) => (
                              <div key={index} className="border-b border-border pb-3 last:border-0">
                                <div className="flex justify-between items-start">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    interaction.type === 'appel' 
                                      ? 'bg-primary/20 text-primary' 
                                      : 'bg-info/20 text-info'
                                  }`}>
                                    {interaction.type === 'appel' ? 'Appel' : 'Email'}
                                  </span>
                                  <p className="text-xs text-muted-foreground">{interaction.date}</p>
                                </div>
                                <p className="mt-2 text-sm text-foreground">{interaction.description}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Aucun contact récent</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-4">
                    <div className="p-6 rounded-lg"> {/*Removed bg-accent*/}
                      <h5 className="font-medium text-foreground mb-4">Documents du client</h5>

                      <div className="space-y-6">
                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-3">Pièce d'identité</h6>
                          {client.documents?.identite ? (
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground">identite_{client.id}.jpg</span>
                              <Button variant="link" size="sm" className="ml-2 text-primary text-xs p-0">
                                Voir
                              </Button>
                            </div>
                          ) : (
                            <FileUpload
                              onUploadComplete={handleUploadComplete("identite")}
                              clientId={client.id}
                              documentType="identite"
                              label="Télécharger la pièce d'identité"
                            />
                          )}
                        </div>

                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-3">Permis de conduire</h6>
                          {client.permis?.document_url ? (
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground">permis_{client.id}.jpg</span>
                              <Button variant="link" size="sm" className="ml-2 text-primary text-xs p-0">
                                Voir
                              </Button>
                            </div>
                          ) : (
                            <FileUpload
                              onUploadComplete={handleUploadComplete("permis")}
                              clientId={client.id}
                              documentType="permis"
                              label="Télécharger le permis"
                            />
                          )}
                        </div>

                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-3">Carte grise</h6>
                          {client.vehicule?.document_url ? (
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground">carte_grise_{client.id}.jpg</span>
                              <Button variant="link" size="sm" className="ml-2 text-primary text-xs p-0">
                                Voir
                              </Button>
                            </div>
                          ) : (
                            <FileUpload
                              onUploadComplete={handleUploadComplete("carte_grise")}
                              clientId={client.id}
                              documentType="carte_grise"
                              label="Télécharger la carte grise"
                            />
                          )}
                        </div>

                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-3">Justificatif de domicile</h6>
                          {client.documents?.domicile ? (
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground">domicile_{client.id}.jpg</span>
                              <Button variant="link" size="sm" className="ml-2 text-primary text-xs p-0">
                                Voir
                              </Button>
                            </div>
                          ) : (
                            <FileUpload
                              onUploadComplete={handleUploadComplete("domicile")}
                              clientId={client.id}
                              documentType="domicile"
                              label="Télécharger le justificatif"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="historique" className="mt-4">
                    <div className="p-6 rounded-lg"> {/*Removed bg-accent*/}
                      <h5 className="font-medium text-foreground mb-4">Historique d'interactions</h5>

                      <div className="space-y-4">
                        {client.interactions && client.interactions.length > 0 ? (
                          client.interactions.map((interaction, index) => (
                            <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                              <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${
                                interaction.type === 'appel' 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'bg-info/10 text-info'
                              }`}>
                                {interaction.type === 'appel' ? <Phone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h6 className="text-sm font-medium text-foreground">
                                    {interaction.type === 'appel' ? 'Appel téléphonique' : 'Email envoyé'}
                                  </h6>
                                  <span className="text-xs text-muted-foreground">{interaction.date}</span>
                                </div>
                                <p className="mt-1 text-sm text-foreground">{interaction.description}</p>
                                {interaction.agent && (
                                  <p className="mt-2 text-xs text-muted-foreground">
                                    Par: {interaction.agent}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Aucune interaction enregistrée</p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border">
                        <h6 className="text-sm font-medium text-foreground mb-3">Ajouter une nouvelle interaction</h6>
                        <div className="flex flex-col md:flex-row gap-3">
                          <Button variant="outline" className="flex items-center flex-1">
                            <Phone className="h-4 w-4 mr-2" />
                            Enregistrer un appel
                          </Button>
                          <Button variant="outline" className="flex items-center flex-1">
                            <Mail className="h-4 w-4 mr-2" />
                            Enregistrer un email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-4">
                    <div className="p-6 rounded-lg"> {/*Removed bg-accent*/}
                      <h5 className="font-medium text-foreground mb-4">Notes</h5>

                      <div className="space-y-4">
                        {client.notes && client.notes.length > 0 ? (
                          client.notes.map((note, index) => (
                            <div key={index} className="border-b border-border pb-3 last:border-0">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-foreground">{note.titre || 'Note'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {note.date} {note.auteur && `par ${note.auteur}`}
                                </p>
                              </div>
                              <p className="mt-2 text-sm text-foreground">{note.contenu}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Aucune note enregistrée</p>
                        )}
                      </div>

                      <div className="mt-4">
                        <Textarea 
                          className="w-full bg-surface border border-border rounded-lg py-2 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
                          rows={3} 
                          placeholder="Ajouter une note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="mt-2 flex justify-end">
                          <Button onClick={handleAddNote}>
                            Enregistrer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}