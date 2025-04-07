import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WantedNotice } from '@shared/schema';

const WantedNoticesSection: React.FC = () => {
  const { data: wantedNotices, isLoading, error } = useQuery({
    queryKey: ['/api/wanted-notices'],
  });

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

  if (isLoading) {
    return (
      <Card className="p-5 bg-dark-card rounded-lg shadow">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array(2).fill(0).map((_, index) => (
              <div key={index} className="overflow-hidden transition-all duration-200 bg-dark-lighter rounded-lg">
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
        </CardContent>
        <CardFooter className="px-0 pb-0">
          <Skeleton className="w-full h-9 mt-4" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-5 bg-dark-card rounded-lg shadow">
        <CardContent>
          <div className="text-danger">
            <p>Erreur lors du chargement des avis de recherche.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-5 bg-dark-card rounded-lg shadow">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-bold text-textLight">Avis de Recherche</CardTitle>
          <Link href="/wanted">
            <a className="text-sm text-primary hover:underline">Voir tout</a>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {wantedNotices && wantedNotices.length > 0 ? (
            wantedNotices.slice(0, 2).map((notice: WantedNotice) => (
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
                  <p className="mt-1 text-xs text-gray-400">Dernier signalement: {notice.lastSeen}</p>
                  <div className="flex justify-end mt-2">
                    <Link href={`/wanted/${notice.id}`}>
                      <a className="px-2 py-1 text-xs text-primary bg-primary bg-opacity-10 rounded hover:bg-opacity-20">
                        <i className="fas fa-info-circle mr-1"></i> Détails
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 bg-dark-lighter rounded-lg">
              <i className="fas fa-exclamation-triangle text-primary text-3xl mb-2"></i>
              <p className="text-gray-400">Aucun avis de recherche en cours</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-0 pb-0">
        <Link href="/wanted/new">
          <a className="w-full">
            <Button 
              className="w-full px-4 py-2 mt-4 text-sm font-medium text-white transition-colors duration-150 bg-primary rounded-lg hover:bg-opacity-90 focus:outline-none"
            >
              Créer un avis de recherche
            </Button>
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default WantedNoticesSection;
