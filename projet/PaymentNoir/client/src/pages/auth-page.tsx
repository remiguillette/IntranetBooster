import { useState, FC } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockKeyhole, UserPlus, User, Eye, EyeOff } from "lucide-react";
import { insertUserSchema } from "@shared/schema";

// Extend the user schema with client-side validation
const loginSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

// Add password confirmation for registration
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(8, "La confirmation du mot de passe doit contenir au moins 8 caractères")
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage: FC = () => {
  const [, navigate] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: ""
    }
  });
  
  // Handle login submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };
  
  // Handle register submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };
  
  // Redirect if user is already authenticated
  if (user) {
    navigate("/");
    return null;
  }
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Form Column */}
        <Card className="w-full max-w-md mx-auto bg-[#242424] shadow-xl border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Paiement Sécurisé
            </CardTitle>
            <CardDescription className="text-gray-400">
              Connectez-vous ou créez un compte pour accéder à votre espace client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-[#1a1a1a]">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                placeholder="Entrez votre nom d'utilisateur" 
                                className="pl-10 bg-[#1a1a1a] border-gray-700 text-gray-300"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Entrez votre mot de passe" 
                                className="pl-10 pr-10 bg-[#1a1a1a] border-gray-700 text-gray-300"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-black font-medium"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connexion en cours...
                        </>
                      ) : "Se connecter"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                placeholder="Choisissez un nom d'utilisateur" 
                                className="pl-10 bg-[#1a1a1a] border-gray-700 text-gray-300"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Créez un mot de passe sécurisé" 
                                className="pl-10 pr-10 bg-[#1a1a1a] border-gray-700 text-gray-300"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Confirmez le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Répétez votre mot de passe" 
                                className="pl-10 pr-10 bg-[#1a1a1a] border-gray-700 text-gray-300"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-black font-medium"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Inscription en cours...
                        </>
                      ) : "S'inscrire"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Hero/Info Column */}
        <div className="relative hidden md:block">
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#242424] to-[#121212] border border-gray-800 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-primary">Paiements Sécurisés et Conformes</h2>
            <p className="text-gray-300 mb-6">
              Notre plateforme de paiement est conforme aux normes les plus strictes en matière de sécurité des paiements, 
              y compris PCI DSS, ISO 27001 et les exigences de Mastercard.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">Sécurité de niveau bancaire</h3>
                  <p className="text-gray-400">Toutes les données de paiement sont chiffrées avec des standards de sécurité bancaire.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.91 8.84L8.56 2.23a1.93 1.93 0 00-1.81 0L3.1 4.13a1.93 1.93 0 00-.97 1.68v4.62a9.08 9.08 0 005.03 8.15l2.36 1.36a1.2 1.2 0 001.2 0l2.36-1.36a9.08 9.08 0 005.03-8.15V5.81c0-.82-.5-1.57-1.26-1.86l-2.01-.97z"></path>
                    <path d="M3.09 4.13a1.93 1.93 0 011.81-3.60L20.91 8.84c2.15 1.13 2.37 4.21.41 5.68"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">Conformité PCI DSS</h3>
                  <p className="text-gray-400">Notre plateforme respecte strictement les normes PCI DSS pour le traitement des cartes de crédit.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">Multiples options de paiement</h3>
                  <p className="text-gray-400">Acceptez les paiements par Mastercard, PayPal et Interac e-Transfer en toute sécurité.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-[#121212] rounded-lg border border-gray-800">
              <p className="text-gray-300 text-sm">
                <strong className="text-primary">Note:</strong> En créant un compte, vous pourrez accéder à votre historique de paiements, 
                gérer vos méthodes de paiement préférées et bénéficier d'un processus de paiement simplifié pour vos futures transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;