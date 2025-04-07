import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SearchBar from '@/components/ui/SearchBar';
import AnimalTable from '@/components/dashboard/AnimalTable';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertAnimalSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Extend the insertAnimalSchema with validation rules
const newAnimalSchema = insertAnimalSchema.extend({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  species: z.string().min(2, "L'espèce doit être spécifiée"),
});

const AnimalManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors }
  } = useForm({
    resolver: zodResolver(newAnimalSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      ownerName: '',
      ownerLocation: '',
      status: 'enregistré',
      image: '',
      notes: ''
    }
  });

  const createAnimalMutation = useMutation({
    mutationFn: (data: z.infer<typeof newAnimalSchema>) => 
      apiRequest('POST', '/api/animals', data),
    onSuccess: () => {
      toast({
        title: "Animal créé",
        description: "L'animal a été enregistré avec succès",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/animals'] });
      reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de la création: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: z.infer<typeof newAnimalSchema>) => {
    createAnimalMutation.mutate(data);
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary font-montserrat mb-4 sm:mb-0">Gestion des Animaux</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <SearchBar
            placeholder="Rechercher un animal..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-64"
          />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90 focus:outline-none">
                <i className="fas fa-plus mr-2"></i>Nouvel Animal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-dark-card text-textLight">
              <DialogHeader>
                <DialogTitle className="text-primary">Ajouter un nouvel animal</DialogTitle>
                <DialogDescription>
                  Entrez les informations de l'animal à enregistrer dans le système.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="name" className="text-textLight">Nom</Label>
                      <Input 
                        id="name" 
                        className="bg-dark-lighter border-dark-lighter"
                        {...register("name")} 
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="species" className="text-textLight">Espèce</Label>
                      <Input 
                        id="species"
                        className="bg-dark-lighter border-dark-lighter"
                        {...register("species")}
                      />
                      {errors.species && (
                        <p className="text-xs text-red-500 mt-1">{errors.species.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="breed" className="text-textLight">Race/Sous-espèce</Label>
                      <Input 
                        id="breed"
                        className="bg-dark-lighter border-dark-lighter"
                        {...register("breed")}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="status" className="text-textLight">Statut</Label>
                      <Select defaultValue="enregistré" onValueChange={(value) => {
                        // Update the form value
                        //@ts-ignore - react-hook-form types issue
                        register("status").onChange({ target: { value } });
                      }}>
                        <SelectTrigger className="bg-dark-lighter border-dark-lighter">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-lighter text-textLight">
                          <SelectItem value="enregistré">Enregistré</SelectItem>
                          <SelectItem value="en_révision">En révision</SelectItem>
                          <SelectItem value="attention_requise">Attention requise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator className="bg-dark-lighter" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="ownerName" className="text-textLight">Nom du propriétaire</Label>
                      <Input 
                        id="ownerName"
                        className="bg-dark-lighter border-dark-lighter"
                        {...register("ownerName")}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="ownerLocation" className="text-textLight">Localisation</Label>
                      <Input 
                        id="ownerLocation"
                        className="bg-dark-lighter border-dark-lighter"
                        {...register("ownerLocation")}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="image" className="text-textLight">URL de l'image</Label>
                    <Input 
                      id="image"
                      className="bg-dark-lighter border-dark-lighter"
                      placeholder="https://..."
                      {...register("image")}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-textLight">Notes</Label>
                    <textarea 
                      id="notes"
                      className="w-full px-3 py-2 bg-dark-lighter border border-dark-lighter rounded-md text-textLight"
                      rows={3}
                      {...register("notes")}
                    ></textarea>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-opacity-90"
                    disabled={createAnimalMutation.isPending}
                  >
                    {createAnimalMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-dark-lighter mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">Tous les animaux</TabsTrigger>
          <TabsTrigger value="registered" className="data-[state=active]:bg-primary data-[state=active]:text-white">Enregistrés</TabsTrigger>
          <TabsTrigger value="attention" className="data-[state=active]:bg-primary data-[state=active]:text-white">Attention requise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <AnimalTable />
        </TabsContent>
        
        <TabsContent value="registered" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Vue filtrée des animaux enregistrés.
                <br />
                <span className="text-sm">(Le filtrage par status sera implémenté prochainement)</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attention" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Vue filtrée des animaux nécessitant une attention.
                <br />
                <span className="text-sm">(Le filtrage par status sera implémenté prochainement)</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimalManagement;
