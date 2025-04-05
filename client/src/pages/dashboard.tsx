import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Application } from "@/types/application";
import ApplicationCard from "@/components/application-card";
import UserDropdown from "@/components/ui/user-dropdown";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);
  
  const { data: applications, isLoading, error } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated,
  });
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      {/* Header with navigation */}
      <header className="bg-[#1E1E1E] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#f89422]">Beavernet</h1>
            </div>
            
            {user && <UserDropdown user={user} />}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-[#f89422] mb-6">Applications</h2>
          
          {isLoading && (
            <div className="text-center py-10">
              <p className="text-gray-300">Chargement des applications...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-10">
              <p className="text-red-500">
                Erreur lors du chargement des applications.
              </p>
            </div>
          )}
          
          {!isLoading && applications && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#1E1E1E] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-400">© 2023 Beavernet - Tous droits réservés</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-[#f89422]">
                Aide
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#f89422]">
                Confidentialité
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#f89422]">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
