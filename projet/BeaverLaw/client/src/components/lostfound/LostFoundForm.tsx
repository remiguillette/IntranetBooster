import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertLostFoundAnimalSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Map from './Map';

// Define a schema for coordinates
const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

// Extend the insertLostFoundAnimalSchema with validation rules
const lostFoundFormSchema = insertLostFoundAnimalSchema
  .omit({ locationCoordinates: true })
  .extend({
    type: z.enum(['lost', 'found'], {
      required_error: "Le type doit être spécifié (perdu ou trouvé)"
    }),
    species: z.string().min(2, "L'espèce doit être spécifiée"),
    description: z.string().min(5, "La description doit être plus détaillée"),
    location: z.string().min(3, "La localisation doit être spécifiée"),
    reporterName: z.string().min(2, "Votre nom doit être spécifié"),
    reporterContact: z.string().min(5, "Un moyen de contact doit être spécifié"),
    lat: z.number().optional(),
    lng: z.number().optional(),
  });

type LostFoundFormData = z.infer<typeof lostFoundFormSchema>;

interface LostFoundFormProps {
  defaultValues?: Partial<LostFoundFormData>;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const LostFoundForm: React.FC<LostFoundFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LostFoundFormData>({
    resolver: zodResolver(lostFoundFormSchema),
    defaultValues: {
      type: 'lost',
      species: '',
      breed: '',
      description: '',
      location: '',
      reporterName: '',
      reporterContact: '',
      image: '',
      ...defaultValues
    }
  });

  // Transform form data before submission to match API expectations
  const handleFormSubmit = (data: LostFoundFormData) => {
    // Create the location coordinates object
    const transformedData = {
      ...data,
      locationCoordinates: {
        lat: data.lat || 46.8, // Default to Quebec City if not provided
        lng: data.lng || -71.2
      }
    };
    
    // Remove the separate lat/lng fields
    delete transformedData.lat;
    delete transformedData.lng;
    
    onSubmit(transformedData);
  };

  // Handle map marker placement
  const handleMapClick = (lat: number, lng: number) => {
    setValue('lat', lat);
    setValue('lng', lng);
  };

  const animalType = watch('type');

  return (
    <Card className="w-full bg-dark-card text-textLight">
      <CardHeader>
        <CardTitle className="text-primary">Signaler un animal {animalType === 'lost' ? 'perdu' : 'trouvé'}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div>
              <Label className="text-textLight mb-2 block">Type de signalement</Label>
              <RadioGroup 
                defaultValue={defaultValues?.type || "lost"} 
                onValueChange={(value) => setValue('type', value as 'lost' | 'found')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lost" id="lost" className="text-primary" />
                  <Label htmlFor="lost" className="text-textLight">Animal perdu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="found" id="found" className="text-primary" />
                  <Label htmlFor="found" className="text-textLight">Animal trouvé</Label>
                </div>
              </RadioGroup>
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
                <Label htmlFor="breed" className="text-textLight">Race/Sous-espèce</Label>
                <Input 
                  id="breed"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("breed")}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-textLight">Description</Label>
              <textarea 
                id="description"
                className="w-full px-3 py-2 bg-dark-lighter border border-dark-lighter rounded-md text-textLight"
                rows={3}
                {...register("description")}
              ></textarea>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>
            
            <Separator className="bg-dark-lighter" />
            
            <div>
              <Label htmlFor="location" className="text-textLight">Localisation (adresse ou description)</Label>
              <Input 
                id="location"
                className="bg-dark-lighter border-dark-lighter"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>
            
            <div>
              <Label className="text-textLight mb-2 block">Position sur la carte</Label>
              <p className="text-xs text-gray-400 mb-2">Cliquez sur la carte pour marquer l'emplacement exact</p>
              <div className="h-60 w-full rounded-md overflow-hidden">
                <Map 
                  onClick={handleMapClick}
                  initialMarker={
                    defaultValues?.lat && defaultValues?.lng 
                      ? { lat: defaultValues.lat, lng: defaultValues.lng }
                      : undefined
                  }
                />
              </div>
              {(errors.lat || errors.lng) && (
                <p className="text-xs text-red-500 mt-1">Veuillez indiquer la position sur la carte</p>
              )}
            </div>
            
            <Separator className="bg-dark-lighter" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporterName" className="text-textLight">Votre nom</Label>
                <Input 
                  id="reporterName"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("reporterName")}
                />
                {errors.reporterName && (
                  <p className="text-xs text-red-500 mt-1">{errors.reporterName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="reporterContact" className="text-textLight">Contact (téléphone ou email)</Label>
                <Input 
                  id="reporterContact"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("reporterContact")}
                />
                {errors.reporterContact && (
                  <p className="text-xs text-red-500 mt-1">{errors.reporterContact.message}</p>
                )}
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
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-primary hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LostFoundForm;
