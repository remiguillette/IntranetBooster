import { useState } from "react";
import { useLocation } from "wouter";
import { User } from "@shared/schema";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

interface UserDropdownProps {
  user: Omit<User, "password">;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { clearUser } = useAuth();
  
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout", {});
      return res.json();
    },
    onSuccess: () => {
      clearUser();
      setLocation("/");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la déconnexion",
      });
    },
  });
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-gray-200 hover:text-[#f89422]">
          {user.profileImage ? (
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-[#f89422]">
              <img 
                src={user.profileImage} 
                alt={user.initials} 
                className="h-full w-full object-cover" 
              />
            </div>
          ) : (
            <span className="h-8 w-8 rounded-full bg-[#f89422] flex items-center justify-center text-white">
              {user.initials}
            </span>
          )}
          <span className="hidden md:block">{user.displayName}</span>
          <ChevronDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1E1E1E] text-gray-200 border-gray-700">
        <DropdownMenuItem 
          onClick={() => setLocation("/profile")} 
          className="hover:bg-[#2D2D2D] cursor-pointer"
        >
          Mon profil
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#2D2D2D]">
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout} 
          disabled={logoutMutation.isPending}
          className="hover:bg-[#2D2D2D]"
        >
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
