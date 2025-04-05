import { FC, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export const AdminLogin: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/admin/login', {
        username,
        password
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Identifiants invalides');
      }

      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté à l\'interface d\'administration',
      });

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-[#242424]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary font-semibold">Administration</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Nom d'utilisateur</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#121212] border-gray-700 text-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#121212] border-gray-700 text-gray-300"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-black font-medium h-12"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⭘</span>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center text-sm text-gray-400">
          <p>Sécurisé par PCI DSS • ISO 27001</p>
        </CardFooter>
      </Card>
    </div>
  );
};