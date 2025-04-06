import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, Upload, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Effet pour mettre à jour l'image de profil quand l'utilisateur change
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user]);
  
  // Mutation pour mettre à jour l'image de profil
  const updateProfileImageMutation = useMutation({
    mutationFn: async (profileImage: string) => {
      const res = await fetch('/api/user/profile-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileImage }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur lors de la mise à jour de l'image de profil");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      // Mettre à jour l'utilisateur dans le contexte d'authentification
      setUser(data);
      toast({
        title: "Succès",
        description: "Votre photo de profil a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour de l'image de profil",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez sélectionner une image valide."
        });
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "L'image est trop volumineuse. Taille maximale: 5MB."
        });
        return;
      }

      // Créer une URL pour prévisualiser l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setProfileImage(imageData);
        
        // Envoyer l'image au serveur
        updateProfileImageMutation.mutate(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#f89422]">Mon Profil</h1>
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-200 hover:bg-[#2D2D2D] hover:text-[#f89422]"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Photo Card */}
          <Card className="bg-[#1E1E1E] border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle className="text-[#f89422]">Photo de profil</CardTitle>
              <CardDescription className="text-gray-400">
                Téléchargez votre photo de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                {profileImage ? (
                  <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-[#f89422]">
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 rounded-full bg-[#2D2D2D] flex items-center justify-center border-4 border-[#f89422]">
                    <User className="h-20 w-20 text-gray-400" />
                  </div>
                )}
                <button 
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-[#f89422] p-2 rounded-full"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <Button 
                onClick={triggerFileInput}
                variant="outline" 
                className="mt-2 border-gray-700 hover:bg-[#2D2D2D] hover:text-[#f89422]"
              >
                <Upload className="mr-2 h-4 w-4" />
                Changer la photo
              </Button>
            </CardContent>
          </Card>

          {/* User Information Card */}
          <Card className="bg-[#1E1E1E] border-gray-700 text-gray-200 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#f89422]">Informations personnelles</CardTitle>
              <CardDescription className="text-gray-400">
                Vos informations de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-gray-300">Nom d'affichage</Label>
                <Input 
                  id="displayName" 
                  defaultValue={user.displayName}
                  className="bg-[#2D2D2D] border-gray-700 text-gray-200"
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="username" className="text-gray-300">Nom d'utilisateur</Label>
                <Input 
                  id="username" 
                  defaultValue={user.username}
                  className="bg-[#2D2D2D] border-gray-700 text-gray-200"
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-gray-300">Rôle</Label>
                <Input 
                  id="role" 
                  defaultValue={user.role || "Utilisateur"}
                  className="bg-[#2D2D2D] border-gray-700 text-gray-200"
                  readOnly
                />
              </div>
              
              <div className="pt-4">
                <Button
                  variant="default"
                  className="bg-[#f89422] hover:bg-[#e78312] text-white"
                >
                  Mettre à jour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}