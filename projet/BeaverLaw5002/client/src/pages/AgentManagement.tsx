import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import PageHeader from '@/components/common/PageHeader';

// Schema for agent form
const agentSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  role: z.string().min(2, "Le rôle doit être spécifié"),
  badge: z.string().min(2, "Le numéro de badge doit être spécifié"),
  location: z.string().optional(),
  avatar: z.string().optional(),
});

type AgentFormData = z.infer<typeof agentSchema>;

const AgentManagement: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['/api/users'],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      username: '',
      password: '',
      name: '',
      role: '',
      badge: '',
      location: '',
      avatar: ''
    }
  });

  const createAgentMutation = useMutation({
    mutationFn: (data: AgentFormData) => apiRequest('POST', '/api/users', data),
    onSuccess: () => {
      toast({
        title: "Agent créé",
        description: "Le nouvel agent a été créé avec succès",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsFormOpen(false);
      reset();
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

  const onSubmit = (data: AgentFormData) => {
    createAgentMutation.mutate(data);
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Gestion des Agents"
        searchPlaceholder="Rechercher un agent..."
        buttonLabel="Nouvel Agent"
        buttonIcon="fas fa-user-plus"
        onSearch={handleSearch}
        onButtonClick={() => setIsFormOpen(true)}
      />

      <Card className="bg-dark-card mt-6">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 text-danger">
              Une erreur est survenue lors du chargement des agents.
            </div>
          ) : !agents || agents.length === 0 ? (
            <div className="p-6 text-center">
              <i className="fas fa-users text-primary text-4xl mb-4"></i>
              <p className="text-textLight">Aucun agent enregistré</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-dark-lighter">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Agent</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Badge</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Rôle</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Lieu</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Statut</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-dark-lighter">
                  {agents.map((agent: User) => (
                    <TableRow key={agent.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            {agent.avatar ? (
                              <img 
                                className="w-10 h-10 rounded-full" 
                                src={agent.avatar} 
                                alt={agent.name} 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                                <i className="fas fa-user text-primary"></i>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-textLight">{agent.name}</div>
                            <div className="text-xs text-gray-400">{agent.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-textLight">{agent.badge}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-textLight">{agent.role}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-textLight">{agent.location || 'Non spécifié'}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          agent.isOnline 
                            ? 'text-success bg-success bg-opacity-10' 
                            : 'text-gray-400 bg-gray-600 bg-opacity-10'
                        }`}>
                          {agent.isOnline ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div 
                          className="cursor-pointer inline-flex items-center text-primary hover:text-primary-dark"
                          onClick={() => window.location.href = `/agents/${agent.id}/edit`}
                        >
                          <i className="fas fa-edit mr-1"></i> Modifier
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md bg-dark-card text-textLight">
          <DialogHeader>
            <DialogTitle className="text-primary">Ajouter un agent</DialogTitle>
            <DialogDescription>
              Entrez les informations du nouvel agent.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name" className="text-textLight">Nom complet</Label>
                <Input 
                  id="name" 
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("name")} 
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge" className="text-textLight">Numéro de badge</Label>
                  <Input 
                    id="badge"
                    className="bg-dark-lighter border-dark-lighter"
                    {...register("badge")}
                  />
                  {errors.badge && (
                    <p className="text-xs text-red-500 mt-1">{errors.badge.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role" className="text-textLight">Rôle</Label>
                  <Input 
                    id="role"
                    className="bg-dark-lighter border-dark-lighter"
                    {...register("role")}
                  />
                  {errors.role && (
                    <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="location" className="text-textLight">Lieu d'affectation</Label>
                <Input 
                  id="location"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("location")}
                />
              </div>
              
              <div>
                <Label htmlFor="username" className="text-textLight">Nom d'utilisateur</Label>
                <Input 
                  id="username"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="password" className="text-textLight">Mot de passe</Label>
                <Input 
                  id="password"
                  type="password"
                  className="bg-dark-lighter border-dark-lighter"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="avatar" className="text-textLight">URL de l'avatar (optionnel)</Label>
                <Input 
                  id="avatar"
                  className="bg-dark-lighter border-dark-lighter"
                  placeholder="https://..."
                  {...register("avatar")}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-opacity-90"
                disabled={createAgentMutation.isPending}
              >
                {createAgentMutation.isPending ? 'Création...' : 'Créer l\'agent'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentManagement;
