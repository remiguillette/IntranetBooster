import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { LostFoundAnimal } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/PageHeader';
import Map from '@/components/lostfound/Map';
import LostFoundForm from '@/components/lostfound/LostFoundForm';
import { createMarker, createPopupContent, getTimeSince } from '@/lib/mapUtils';

const LostFound: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: lostFoundAnimals, isLoading, error } = useQuery({
    queryKey: ['/api/lost-found'],
  });

  const createLostFoundMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/lost-found', data),
    onSuccess: () => {
      toast({
        title: "Signalement créé",
        description: "Votre signalement a été enregistré avec succès",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/lost-found'] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de création: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  const handleFormSubmit = (data: any) => {
    createLostFoundMutation.mutate(data);
  };

  // Prepare data for map
  const mapMarkers = lostFoundAnimals ? lostFoundAnimals.map((animal: LostFoundAnimal) => {
    const coordinates = animal.locationCoordinates as { lat: number; lng: number };
    if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
      return null;
    }
    
    const icon = animal.type === 'lost' 
      ? 'bg-danger' 
      : 'bg-success';
    
    return {
      position: coordinates,
      popup: createPopupContent(animal),
      icon: createMarker(animal)?.getIcon()
    };
  }).filter(Boolean) : [];

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Animaux Perdus/Trouvés"
        searchPlaceholder="Rechercher un signalement..."
        buttonLabel="Signaler un animal"
        buttonIcon="fas fa-plus"
        onSearch={handleSearch}
        onButtonClick={() => setIsFormOpen(true)}
      />

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="bg-dark-lighter mb-6">
          <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Carte
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Liste
          </TabsTrigger>
          <TabsTrigger value="lost" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Perdus
          </TabsTrigger>
          <TabsTrigger value="found" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Trouvés
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-0">
          <Card className="bg-dark-card">
            <CardHeader>
              <CardTitle className="text-lg text-textLight">Carte des signalements</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-96 w-full rounded-md overflow-hidden">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <Map 
                    markers={mapMarkers} 
                    center={{ lat: 46.8, lng: -71.2 }} 
                    zoom={8}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex p-4 bg-dark-lighter rounded-lg">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="ml-4 flex-1">
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-4 w-64 mb-2" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-6 text-danger">
                  Une erreur est survenue lors du chargement des signalements.
                </div>
              ) : !lostFoundAnimals || lostFoundAnimals.length === 0 ? (
                <div className="p-6 text-center">
                  <i className="fas fa-search text-primary text-4xl mb-4"></i>
                  <p className="text-textLight">Aucun signalement d'animal perdu ou trouvé</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {lostFoundAnimals.map((animal: LostFoundAnimal) => (
                    <div key={animal.id} className="flex p-4 bg-dark-lighter rounded-lg hover:bg-opacity-80 transition-colors">
                      <div className="flex-shrink-0 w-16 h-16">
                        {animal.image ? (
                          <img 
                            className="object-cover w-16 h-16 rounded-md" 
                            src={animal.image} 
                            alt={`${animal.species} ${animal.type === 'lost' ? 'perdu' : 'trouvé'}`} 
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-dark flex items-center justify-center">
                            <i className="fas fa-paw text-primary text-2xl"></i>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-lg font-medium text-textLight">
                            {animal.species} {animal.breed ? `(${animal.breed})` : ''}
                          </h3>
                          <Badge variant={animal.type === 'lost' ? 'danger' : 'success'}>
                            {animal.type === 'lost' ? 'Perdu' : 'Trouvé'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{animal.description}</p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-gray-400">
                            <i className="fas fa-map-marker-alt mr-1"></i> {animal.location}
                          </p>
                          <p className="text-sm text-gray-400">
                            {getTimeSince(animal.reportDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lost" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Vue filtrée des animaux perdus.
                <br />
                <span className="text-sm">(Le filtrage par type sera implémenté prochainement)</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="found" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Vue filtrée des animaux trouvés.
                <br />
                <span className="text-sm">(Le filtrage par type sera implémenté prochainement)</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lost/Found Report Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl bg-dark-card text-textLight">
          <DialogHeader>
            <DialogTitle className="text-primary">Signaler un animal perdu ou trouvé</DialogTitle>
          </DialogHeader>
          <LostFoundForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={createLostFoundMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LostFound;
