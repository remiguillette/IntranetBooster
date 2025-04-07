import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Infraction } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/PageHeader';
import InfractionForm from '@/components/regulations/InfractionForm';

const Regulations: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: infractions, isLoading, error } = useQuery({
    queryKey: ['/api/infractions'],
  });

  const createInfractionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/infractions', data),
    onSuccess: () => {
      toast({
        title: "Infraction enregistrée",
        description: "L'infraction a été enregistrée avec succès",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/infractions'] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec d'enregistrement: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  const handleFormSubmit = (data: any) => {
    createInfractionMutation.mutate(data);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processed': return 'success';
      case 'appealed': return 'danger';
      default: return 'primary';
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processed': return 'Traité';
      case 'appealed': return 'Contesté';
      default: return status;
    }
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Application des Règlements"
        searchPlaceholder="Rechercher une infraction..."
        buttonLabel="Nouvelle infraction"
        buttonIcon="fas fa-plus"
        onSearch={handleSearch}
        onButtonClick={() => setIsFormOpen(true)}
      />

      <Tabs defaultValue="all" className="w-full mt-6">
        <TabsList className="bg-dark-lighter mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Toutes les infractions
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            En attente
          </TabsTrigger>
          <TabsTrigger value="processed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Traitées
          </TabsTrigger>
          <TabsTrigger value="appealed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Contestées
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : error ? (
                <div className="p-4 text-danger">
                  Une erreur est survenue lors du chargement des infractions.
                </div>
              ) : !infractions || infractions.length === 0 ? (
                <div className="p-6 text-center">
                  <i className="fas fa-clipboard-list text-primary text-4xl mb-4"></i>
                  <p className="text-textLight">Aucune infraction enregistrée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-dark-lighter">
                      <TableRow>
                        <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Type</TableHead>
                        <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Lieu</TableHead>
                        <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Contrevenant</TableHead>
                        <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Amende</TableHead>
                        <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Date</TableHead>
                        <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Statut</TableHead>
                        <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-dark-lighter">
                      {infractions.map((infraction: Infraction) => (
                        <TableRow key={infraction.id}>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-textLight">{infraction.type}</div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-textLight">{infraction.location}</div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-textLight">{infraction.offenderName || 'Non spécifié'}</div>
                            {infraction.offenderContact && (
                              <div className="text-xs text-gray-400">{infraction.offenderContact}</div>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-textLight">
                              {infraction.fine ? `${infraction.fine}$` : 'Non définie'}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{formatDate(infraction.date)}</div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getStatusBadgeVariant(infraction.status)}>
                              {formatStatus(infraction.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                              <i className="fas fa-eye mr-1"></i> Voir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Vue filtrée des infractions en attente.
                <br />
                <span className="text-sm">(Le filtrage par statut sera implémenté prochainement)</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processed" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Vue filtrée des infractions traitées.
                <br />
                <span className="text-sm">(Le filtrage par statut sera implémenté prochainement)</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appealed" className="mt-0">
          <Card className="bg-dark-card">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Vue filtrée des infractions contestées.
                <br />
                <span className="text-sm">(Le filtrage par statut sera implémenté prochainement)</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Infraction Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl bg-dark-card text-textLight">
          <DialogHeader>
            <DialogTitle className="text-primary">Enregistrer une infraction</DialogTitle>
          </DialogHeader>
          <InfractionForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={createInfractionMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Regulations;
