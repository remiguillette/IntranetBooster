import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import beaverLogo from "@/assets/beaver.png";

const loginSchema = z.object({
  username: z.string().email("Veuillez entrer une adresse e-mail valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiRequest("POST", "/api/login", data);
      return res.json();
    },
    onSuccess: (data) => {
      setUser(data);
      setLocation("/dashboard");
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Beavernet",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Nom d'utilisateur ou mot de passe incorrect",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#121212]">
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src={beaverLogo} 
            alt="Beaver mascot" 
            className="w-80 h-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold tracking-wide text-[#f89422] uppercase">BEAVERNET</h1>
        </div>
        
        {/* Login form */}
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
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          className="text-[#f89422] bg-[#2D2D2D] border-gray-700" 
                        />
                      </FormControl>
                      <FormLabel className="text-gray-300 text-sm">Se souvenir de moi</FormLabel>
                    </FormItem>
                  )}
                />
                
                <a href="#" className="text-sm text-[#f89422] hover:underline">
                  Mot de passe oublié?
                </a>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-[#f89422] hover:bg-opacity-90 text-white"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
