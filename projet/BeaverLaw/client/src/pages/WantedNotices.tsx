import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { WantedNotice } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/PageHeader';
import WantedForm from '@/components/wanted/WantedForm';

const WantedNotices: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: wantedNotices, isLoading, error } = useQuery({
    queryKey: ['/api/wanted-notices'],
  });

  const createWantedNoticeMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/wanted-notices', data),
    onSuccess: () => {
      toast({
        title: "Avis créé",
        description: "L'avis de recherche a été créé avec succès",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wanted-notices'] });
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
    createWantedNoticeMutation.mutate(data);
  };

  // Helper function to get badge class based on priority
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-danger';
      case 'observation':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  };

  // Helper function to format priority for display
  const formatPriority = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'URGENT';
      case 'observation':
        return 'OBSERVATION';
      default:
        return 'STANDARD';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Avis de Recherche"
        searchPlaceholder="Rechercher un avis..."
        buttonLabel="Nouvel avis"
        buttonIcon="fas fa-plus"
        onSearch={handleSearch}
        onButtonClick={() => setIsFormOpen(true)}
      />

      <Card className="bg-dark-card mt-6">
        <CardHeader>
          <CardTitle className="text-lg text-textLight">Liste des avis de recherche</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="overflow-hidden transition-all duration-200 bg-dark-lighter rounded-lg">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2 mt-1" />
                    <div className="flex justify-end mt-2">
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-danger p-4">
              Une erreur est survenue lors du chargement des avis de recherche.
            </div>
          ) : !wantedNotices || wantedNotices.length === 0 ? (
            <div className="text-center py-10">
              <i className="fas fa-exclamation-triangle text-primary text-3xl mb-2"></i>
              <p className="text-gray-400">Aucun avis de recherche en cours</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wantedNotices.map((notice: WantedNotice) => (
                <div key={notice.id} className="overflow-hidden transition-all duration-200 bg-dark-lighter rounded-lg hover:transform hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-32">
                    {notice.image ? (
                      <img 
                        className="object-cover w-full h-32" 
                        src={notice.image} 
                        alt={notice.title} 
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-32 bg-dark">
                        <i className="fas fa-exclamation-triangle text-3xl text-primary"></i>
                      </div>
                    )}
                    <div className={`absolute top-0 right-0 p-1 m-2 text-xs font-bold text-white ${getPriorityBadgeClass(notice.priority)} rounded`}>
                      {formatPriority(notice.priority)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-textLight">{notice.title}</h3>
                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">{notice.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {formatDate(notice.creationDate)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="px-2 py-1 text-xs text-primary hover:bg-primary hover:bg-opacity-10 rounded"
                      >
                        <i className="fas fa-info-circle mr-1"></i> Détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wanted Notice Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl bg-dark-card text-textLight">
          <DialogHeader>
            <DialogTitle className="text-primary">Créer un avis de recherche</DialogTitle>
          </DialogHeader>
          <WantedForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={createWantedNoticeMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WantedNotices;
