import { useEffect } from "react";
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
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-8 h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
          <div className="text-6xl mb-6">🦫</div>
          <h1 className="text-3xl font-bold mb-6 text-[#f89422]">{application.name}</h1>
          <div className="max-w-2xl text-center">
            <p className="text-xl text-gray-300 mb-4">{application.description}</p>
            <p className="text-gray-400 mb-8">Cette application serait normalement accessible sur le port {port}.</p>
            <div className="p-6 bg-[#121212] rounded-lg border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-[#f89422] mb-4">Statut de l'application</h3>
              <p className="text-gray-300">L'application est protégée par le système d'authentification Beavernet.</p>
              <p className="text-gray-300 mt-2">Utilisateur connecté: {isAuthenticated ? "Oui ✅" : "Non ⛔"}</p>
            </div>
            <p className="text-gray-400 text-sm">Dans un environnement de production, cette page servirait de proxy vers l'application réelle.</p>
          </div>
        </div>
      </main>
    </div>
  );
}