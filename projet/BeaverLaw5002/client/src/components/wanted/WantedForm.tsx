import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertWantedNoticeSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

// Extend the insertWantedNoticeSchema with validation rules
const wantedFormSchema = insertWantedNoticeSchema.extend({
  title: z.string().min(3, "Le titre doit comporter au moins 3 caractères"),
  description: z.string().min(5, "La description doit être plus détaillée"),
  species: z.string().min(2, "L'espèce doit être spécifiée"),
  lastSeen: z.string().min(3, "Le dernier lieu d'observation doit être spécifié"),
});

type WantedFormData = z.infer<typeof wantedFormSchema>;

interface WantedFormProps {
  defaultValues?: Partial<WantedFormData>;
  onSubmit: (data: WantedFormData) => void;
  isSubmitting?: boolean;
}

const WantedForm: React.FC<WantedFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false
}) => {
  const { data: animals } = useQuery({
    queryKey: ['/api/animals'],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<WantedFormData>({
    resolver: zodResolver(wantedFormSchema),
    defaultValues: {
      title: '',
      description: '',
      species: '',
      lastSeen: '',
      priority: 'standard',
      image: '',
      ...defaultValues
    }
  });

  // Get priority for easy access in the component
  const priority = watch('priority');

  return (
    <Card className="w-full bg-dark-card text-textLight">
      <CardHeader>
        <CardTitle className="text-primary">Créer un avis de recherche</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="priority" className="text-textLight mb-2 block">Priorité</Label>
              <RadioGroup 
                defaultValue={defaultValues?.priority || "standard"} 
                onValueChange={(value) => setValue('priority', value)}
                className="flex flex-wrap space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" className="text-danger" />
                  <Label htmlFor="urgent" className="text-danger">URGENT</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="observation" id="observation" className="text-info" />
                  <Label htmlFor="observation" className="text-info">OBSERVATION</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" className="text-primary" />
                  <Label htmlFor="standard" className="text-primary">STANDARD</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="title" className="text-textLight">Titre de l'avis</Label>
              <Input 
                id="title"
                className="bg-dark-lighter border-dark-lighter"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="lastSeen" className="text-textLight">Dernier lieu d'observation</Label>
                <Input 
                  id="lastSeen"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("lastSeen")}
                />
                {errors.lastSeen && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastSeen.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-textLight">Description détaillée</Label>
              <textarea 
                id="description"
                className="w-full px-3 py-2 bg-dark-lighter border border-dark-lighter rounded-md text-textLight"
                rows={4}
                {...register("description")}
              ></textarea>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
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
              <Label htmlFor="animalId" className="text-textLight">Lier à un animal enregistré (optionnel)</Label>
              <Select 
                defaultValue={defaultValues?.animalId?.toString()} 
                onValueChange={(value) => setValue('animalId', parseInt(value))}
              >
                <SelectTrigger id="animalId" className="bg-dark-lighter border-dark-lighter">
                  <SelectValue placeholder="Sélectionner un animal" />
                </SelectTrigger>
                <SelectContent className="bg-dark-lighter text-textLight">
                  <SelectItem value="">Aucun</SelectItem>
                  {animals && animals.map((animal: any) => (
                    <SelectItem key={animal.id} value={animal.id.toString()}>
                      {animal.name} ({animal.identifier}) - {animal.species}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-primary hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Création en cours...' : 'Créer l\'avis de recherche'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WantedForm;
