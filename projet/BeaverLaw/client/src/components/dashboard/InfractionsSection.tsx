import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Infraction } from '@shared/schema';

const InfractionsSection: React.FC = () => {
  const { data: infractions, isLoading, error } = useQuery({
    queryKey: ['/api/infractions'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="p-4 transition-all duration-200 bg-dark-card rounded-lg shadow">
            <CardContent className="p-0">
              <div className="flex items-start">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2 mt-1" />
                  <div className="flex items-center mt-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-3 w-20 ml-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-dark-card rounded-lg shadow">
        <CardContent>
          <div className="text-danger">
            <p>Erreur lors du chargement des infractions.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!infractions || infractions.length === 0) {
    return (
      <Card className="p-4 bg-dark-card rounded-lg shadow">
        <CardContent>
          <div className="text-center py-6">
            <i className="fas fa-clipboard-list text-primary text-3xl mb-2"></i>
            <p className="text-gray-400">Aucune infraction enregistrée</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format date to local date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Function to determine icon and color based on infraction type
  const getInfractionIconAndColor = (type: string) => {
    if (type.includes('habitat') || type.includes('destruction')) {
      return {
        icon: <i className="fas fa-exclamation-circle text-lg"></i>,
        colorClass: 'text-danger bg-danger bg-opacity-10'
      };
    }
    return {
      icon: <i className="fas fa-clipboard-list text-lg"></i>,
      colorClass: 'text-primary bg-primary bg-opacity-10'
    };
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {infractions.slice(0, 3).map((infraction: Infraction) => {
        const { icon, colorClass } = getInfractionIconAndColor(infraction.type);
        
        return (
          <Card 
            key={infraction.id} 
            className="p-4 transition-all duration-200 bg-dark-card rounded-lg shadow hover:transform hover:-translate-y-1 hover:shadow-md"
          >
            <CardContent className="p-0">
              <div className="flex items-start">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  {icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-textLight">{infraction.type}</h3>
                  <p className="mt-1 text-xs text-gray-400">{infraction.location}</p>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex px-2 py-1 text-xs text-warning bg-warning bg-opacity-10 rounded-full">
                      Amende: {infraction.fine ? `${infraction.fine}$` : 'N/A'}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">{formatDate(infraction.date)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InfractionsSection;
