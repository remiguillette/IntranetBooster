import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertInfractionSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

// Extend the insertInfractionSchema with validation rules
const infractionFormSchema = insertInfractionSchema.extend({
  type: z.string().min(2, "Le type d'infraction doit être spécifié"),
  description: z.string().min(5, "La description doit être plus détaillée"),
  location: z.string().min(3, "La localisation doit être spécifiée"),
  fine: z.coerce.number().optional(),
});

type InfractionFormData = z.infer<typeof infractionFormSchema>;

interface InfractionFormProps {
  defaultValues?: Partial<InfractionFormData>;
  onSubmit: (data: InfractionFormData) => void;
  isSubmitting?: boolean;
}

const InfractionForm: React.FC<InfractionFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false
}) => {
  const { data: agents } = useQuery({
    queryKey: ['/api/users'],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<InfractionFormData>({
    resolver: zodResolver(infractionFormSchema),
    defaultValues: {
      type: '',
      description: '',
      location: '',
      fine: undefined,
      status: 'pending',
      offenderName: '',
      offenderContact: '',
      ...defaultValues
    }
  });

  // Common infraction types
  const infractionTypes = [
    "Nourrissage d'animaux sauvages",
    "Pêche sans permis",
    "Chasse sans permis",
    "Destruction d'habitat protégé",
    "Capture d'espèce protégée",
    "Pollution d'habitat naturel",
    "Déversement de déchets",
    "Autre infraction"
  ];

  return (
    <Card className="w-full bg-dark-card text-textLight">
      <CardHeader>
        <CardTitle className="text-primary">Enregistrer une infraction</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="type" className="text-textLight">Type d'infraction</Label>
              <Select 
                defaultValue={defaultValues?.type} 
                onValueChange={(value) => setValue('type', value)}
              >
                <SelectTrigger id="type" className="bg-dark-lighter border-dark-lighter">
                  <SelectValue placeholder="Sélectionner un type d'infraction" />
                </SelectTrigger>
                <SelectContent className="bg-dark-lighter text-textLight">
                  {infractionTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description" className="text-textLight">Description détaillée</Label>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-textLight">Lieu de l'infraction</Label>
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
                <Label htmlFor="fine" className="text-textLight">Montant de l'amende ($)</Label>
                <Input 
                  id="fine"
                  type="number"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("fine")}
                />
                {errors.fine && (
                  <p className="text-xs text-red-500 mt-1">{errors.fine.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offenderName" className="text-textLight">Nom du contrevenant</Label>
                <Input 
                  id="offenderName"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("offenderName")}
                />
              </div>
              <div>
                <Label htmlFor="offenderContact" className="text-textLight">Contact du contrevenant</Label>
                <Input 
                  id="offenderContact"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("offenderContact")}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status" className="text-textLight">Statut</Label>
              <Select 
                defaultValue={defaultValues?.status || "pending"} 
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger id="status" className="bg-dark-lighter border-dark-lighter">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-dark-lighter text-textLight">
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processed">Traité</SelectItem>
                  <SelectItem value="appealed">Contesté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="agentId" className="text-textLight">Agent responsable</Label>
              <Select 
                defaultValue={defaultValues?.agentId?.toString()} 
                onValueChange={(value) => setValue('agentId', parseInt(value))}
              >
                <SelectTrigger id="agentId" className="bg-dark-lighter border-dark-lighter">
                  <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent className="bg-dark-lighter text-textLight">
                  {agents && agents.map((agent: any) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name} ({agent.badge})
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
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'infraction'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InfractionForm;
