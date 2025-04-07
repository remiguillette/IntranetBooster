import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/ui/SearchBar';
import StatCard from '@/components/dashboard/StatCard';
import AnimalTable from '@/components/dashboard/AnimalTable';
import LostFoundSection from '@/components/dashboard/LostFoundSection';
import WantedNoticesSection from '@/components/dashboard/WantedNoticesSection';
import InfractionsSection from '@/components/dashboard/InfractionsSection';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['/api/statistics'],
  });

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary font-montserrat mb-4 sm:mb-0">Tableau de Bord</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <SearchBar
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            className="w-full sm:w-64"
          />
          <div
            onClick={() => window.location.href = "/animals"}
            className="cursor-pointer"
          >
            <Button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90 focus:outline-none">
              <i className="fas fa-plus mr-2"></i>Nouveau
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Skeleton loaders for statistics cards
          <>
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="p-4 bg-dark-card rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-36 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <div className="flex items-center mt-4">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Animaux Enregistrés"
              value={statistics?.animals.count || 0}
              icon={<i className="fas fa-paw text-primary"></i>}
              change={statistics?.animals.change}
            />
            <StatCard
              title="Animaux Perdus/Trouvés"
              value={statistics?.lostFound.count || 0}
              icon={<i className="fas fa-search text-primary"></i>}
              change={statistics?.lostFound.change}
            />
            <StatCard
              title="Avis de Recherche"
              value={statistics?.wanted.count || 0}
              icon={<i className="fas fa-exclamation-triangle text-primary"></i>}
              change={statistics?.wanted.change}
            />
            <StatCard
              title="Infractions"
              value={statistics?.infractions.count || 0}
              icon={<i className="fas fa-clipboard-list text-primary"></i>}
              change={statistics?.infractions.change}
            />
          </>
        )}
      </div>
      
      {/* Recent Animals Section */}
      <h2 className="mt-8 mb-4 text-xl font-bold text-textLight">Animaux Récemment Enregistrés</h2>
      <AnimalTable limit={3} showPagination={false} />
      
      {/* Lost/Found and Wanted Notices Sections */}
      <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-2">
        <LostFoundSection />
        <WantedNoticesSection />
      </div>
      
      {/* Recent Infractions Section */}
      <h2 className="mt-8 mb-4 text-xl font-bold text-textLight">Infractions Récentes</h2>
      <InfractionsSection />
    </div>
  );
};

export default Dashboard;
