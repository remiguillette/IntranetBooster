import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Loader2, ChevronLeft } from "lucide-react";
import { Application } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AppPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams<{ port: string }>();
  const port = params.port;
  
  // État pour suivre le chargement de l'application
  const [iframeLoading, setIframeLoading] = useState(true);
  
  // Rechercher l'application correspondant au port
  const { data: applications, isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated && !!port,
  });
  
  const application = applications?.find(app => app.port.toString() === port);
  
  // Si le port n'est pas spécifié, rediriger vers le tableau de bord
  useEffect(() => {
    if (!port && !authLoading && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [port, authLoading, isAuthenticated]);
  
  // Gérer le chargement de l'iframe
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };
  
  if (authLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <Loader2 className="h-8 w-8 animate-spin text-[#f89422]" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="text-5xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold mb-4 text-[#f89422]">Accès non autorisé</h1>
        <p className="text-gray-300 mb-6">Vous devez être connecté pour accéder à cette application.</p>
        <Link href="/">
          <Button className="bg-[#f89422] hover:bg-[#e07c10]">Se connecter</Button>
        </Link>
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="text-5xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold mb-4 text-[#f89422]">Application non trouvée</h1>
        <p className="text-gray-300 mb-6">L'application demandée n'existe pas ou n'est pas accessible.</p>
        <Link href="/dashboard">
          <Button className="bg-[#f89422] hover:bg-[#e07c10]">Retour au tableau de bord</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <header className="bg-[#1E1E1E] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="mr-2 text-[#f89422]">
                <ChevronLeft />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-[#f89422]">{application.name}</h1>
          </div>
          <div>
            <span className="text-sm text-gray-400">Port: {application.port}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden h-[calc(100vh-8rem)]">
          {iframeLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-[#f89422]" />
            </div>
          )}
          
          <iframe 
            src={`/proxy/${port}`}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            style={{ display: iframeLoading ? 'none' : 'block' }}
          />
        </div>
      </main>
    </div>
  );
}