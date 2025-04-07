import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LostFoundAnimal } from '@shared/schema';
import { getTimeSince } from '@/lib/mapUtils';

const LostFoundSection: React.FC = () => {
  const { data: lostFoundAnimals, isLoading, error } = useQuery({
    queryKey: ['/api/lost-found'],
  });

  // Function to determine status color
  const getStatusColor = (type: string) => {
    return type === 'lost' ? 'text-danger' : 'text-success';
  };

  // Function to format type for display
  const formatType = (type: string) => {
    return type === 'lost' ? 'Perdu' : 'Trouvé';
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
          <Skeleton className="w-full h-48 mb-4 rounded-lg" />
          <div className="space-y-3">
            {Array(2).fill(0).map((_, index) => (
              <div key={index} className="flex p-3 bg-dark-lighter rounded-lg">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="flex-1 ml-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-3 w-32 mt-1" />
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
            <p>Erreur lors du chargement des données des animaux perdus/trouvés.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-5 bg-dark-card rounded-lg shadow">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-bold text-textLight">Animaux Perdus/Trouvés</CardTitle>
          <Link href="/lost-found">
            <a className="text-sm text-primary hover:underline">Voir tout</a>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Map Placeholder */}
        <div className="relative w-full h-48 mb-4 overflow-hidden bg-dark-lighter rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center bg-dark-lighter">
            <p className="text-gray-400">
              <i className="fas fa-map-marker-alt mr-2"></i>
              Carte Interactive
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {lostFoundAnimals && lostFoundAnimals.length > 0 ? (
            lostFoundAnimals.slice(0, 2).map((animal: LostFoundAnimal) => (
              <div key={animal.id} className="flex p-3 bg-dark-lighter rounded-lg">
                <div className="flex-shrink-0 w-12 h-12">
                  {animal.image ? (
                    <img 
                      className="object-cover w-12 h-12 rounded" 
                      src={animal.image} 
                      alt={`${animal.species} ${formatType(animal.type)}`} 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-dark flex items-center justify-center">
                      <i className="fas fa-paw text-primary"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1 ml-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-textLight">
                      {animal.species} - {formatType(animal.type)}
                    </h3>
                    <span className={`text-xs ${getStatusColor(animal.type)}`}>
                      {getTimeSince(animal.reportDate)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{animal.location}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 bg-dark-lighter rounded-lg">
              <p className="text-gray-400">Aucun animal perdu ou trouvé</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-0 pb-0">
        <Link href="/lost-found/new">
          <a className="w-full">
            <Button 
              className="w-full px-4 py-2 mt-4 text-sm font-medium text-white transition-colors duration-150 bg-primary rounded-lg hover:bg-opacity-90 focus:outline-none"
            >
              Signaler un animal perdu/trouvé
            </Button>
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LostFoundSection;
