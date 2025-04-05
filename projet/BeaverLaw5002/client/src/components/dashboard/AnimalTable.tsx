import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Animal } from '@shared/schema';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'enregistré': return 'success';
    case 'en_révision': return 'info';
    case 'attention_requise': return 'danger';
    case 'perdu': return 'warning';
    case 'trouvé': return 'primary';
    case 'recherché': return 'danger';
    default: return 'primary';
  }
};

// Helper function to format status for display
const formatStatus = (status: string) => {
  switch (status) {
    case 'en_révision': return 'En révision';
    case 'attention_requise': return 'Attention requise';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

interface AnimalTableProps {
  limit?: number;
  showPagination?: boolean;
}

const AnimalTable: React.FC<AnimalTableProps> = ({ limit, showPagination = true }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = limit || 10;

  const { data: animals, isLoading, error } = useQuery({
    queryKey: ['/api/animals'],
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-dark-card rounded-lg shadow">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-dark-lighter">
                <TableRow>
                  <TableHead className="text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Animal</TableHead>
                  <TableHead className="text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Espèce</TableHead>
                  <TableHead className="text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Propriétaire</TableHead>
                  <TableHead className="text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Statut</TableHead>
                  <TableHead className="text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="ml-4">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="w-16 h-3 mt-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                    <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                    <TableCell><Skeleton className="w-20 h-6 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="w-16 h-4" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden bg-dark-card rounded-lg shadow">
        <CardContent className="p-4">
          <div className="text-danger">
            <p>Erreur lors du chargement des données des animaux.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no animals data, show empty state
  if (!animals || animals.length === 0) {
    return (
      <Card className="overflow-hidden bg-dark-card rounded-lg shadow">
        <CardContent className="p-4">
          <div className="text-center py-8">
            <i className="fas fa-paw text-primary text-4xl mb-4"></i>
            <h3 className="text-xl font-semibold">Aucun animal enregistré</h3>
            <p className="text-gray-400 mt-2">Ajoutez votre premier animal en utilisant le bouton "Nouveau"</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(animals.length / itemsPerPage);
  const paginatedAnimals = animals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // List of animals to display
  const displayAnimals = limit ? animals.slice(0, limit) : paginatedAnimals;

  return (
    <Card className="overflow-hidden bg-dark-card rounded-lg shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-dark-lighter">
            <TableRow>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Animal</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Espèce</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Propriétaire</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Statut</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-dark-lighter">
            {displayAnimals.map((animal: Animal) => (
              <TableRow key={animal.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      {animal.image ? (
                        <img 
                          className="w-10 h-10 rounded-full" 
                          src={animal.image} 
                          alt={animal.name} 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-paw text-primary"></i>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-textLight">{animal.name}</div>
                      <div className="text-xs text-gray-400">{animal.identifier}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-textLight">{animal.species}</div>
                  {animal.breed && <div className="text-xs text-gray-400">{animal.breed}</div>}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {animal.ownerName ? (
                    <>
                      <div className="text-sm text-textLight">{animal.ownerName}</div>
                      {animal.ownerLocation && <div className="text-xs text-gray-400">{animal.ownerLocation}</div>}
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">Non spécifié</div>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusBadgeVariant(animal.status)}>
                    {formatStatus(animal.status)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="inline-block cursor-pointer" onClick={() => window.location.href = `/animals/${animal.id}`}>
                    <span className="text-primary hover:text-primary-dark">Voir</span>
                  </div>
                  <div className="inline-block cursor-pointer ml-3" onClick={() => window.location.href = `/animals/${animal.id}/edit`}>
                    <span className="text-info hover:text-blue-400">Modifier</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && animals.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={animals.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </Card>
  );
};

export default AnimalTable;
