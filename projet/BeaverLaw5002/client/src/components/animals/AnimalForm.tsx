import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertAnimalSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Extend the insertAnimalSchema with validation rules
const animalFormSchema = insertAnimalSchema.extend({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  species: z.string().min(2, "L'espèce doit être spécifiée"),
});

type AnimalFormData = z.infer<typeof animalFormSchema>;

interface AnimalFormProps {
  defaultValues?: Partial<AnimalFormData>;
  onSubmit: (data: AnimalFormData) => void;
  isSubmitting?: boolean;
  title?: string;
  submitLabel?: string;
}

const AnimalForm: React.FC<AnimalFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  title = "Informations de l'animal",
  submitLabel = "Enregistrer"
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      ownerName: '',
      ownerLocation: '',
      status: 'enregistré',
      image: '',
      notes: '',
      ...defaultValues
    }
  });

  return (
    <Card className="w-full bg-dark-card text-textLight">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
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
              <div>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="breed" className="text-textLight">Race/Sous-espèce</Label>
                <Input 
                  id="breed"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("breed")}
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-textLight">Statut</Label>
                <Select 
                  defaultValue={defaultValues?.status || "enregistré"} 
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger id="status" className="bg-dark-lighter border-dark-lighter">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-lighter text-textLight">
                    <SelectItem value="enregistré">Enregistré</SelectItem>
                    <SelectItem value="en_révision">En révision</SelectItem>
                    <SelectItem value="attention_requise">Attention requise</SelectItem>
                    <SelectItem value="perdu">Perdu</SelectItem>
                    <SelectItem value="trouvé">Trouvé</SelectItem>
                    <SelectItem value="recherché">Recherché</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>
            
            <Separator className="bg-dark-lighter" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName" className="text-textLight">Nom du propriétaire</Label>
                <Input 
                  id="ownerName"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("ownerName")}
                />
              </div>
              <div>
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
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-primary hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AnimalForm;
