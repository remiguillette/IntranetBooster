import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const registerSchema = z.object({
  username: z.string().email("Veuillez entrer une adresse e-mail valide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  displayName: z.string().min(2, "Le nom d'affichage est requis"),
  initials: z.string().min(1, "Les initiales sont requises").max(3, "3 caractères maximum"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
      initials: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: (data) => {
      setUser(data);
      setLocation("/dashboard");
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur Beavernet",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription",
      });
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#121212]">
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#f89422]">Beavernet</h1>
          <p className="mt-2 text-gray-300">Créer un compte</p>
        </div>
        
        {/* Registration form */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f89422]">Adresse e-mail</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="nom@entreprise.com" 
                        className="bg-[#2D2D2D] border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f89422]">Nom complet</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Jean Dupont" 
                        className="bg-[#2D2D2D] border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="initials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f89422]">Initiales</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="JD" 
                        className="bg-[#2D2D2D] border-gray-700 text-white" 
                        maxLength={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#f89422]">Mot de passe</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-[#2D2D2D] border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#f89422] hover:bg-opacity-90 text-white"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Inscription..." : "S'inscrire"}
                </Button>
                
                <div className="text-center">
                  <a 
                    href="/" 
                    className="text-sm text-[#f89422] hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("/");
                    }}
                  >
                    Vous avez déjà un compte? Se connecter
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>© 2023 Beavernet - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}