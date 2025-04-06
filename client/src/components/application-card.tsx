import { Application } from "@/types/application";
import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  // Get the icon using a simpler approach
  const renderIcon = () => {
    switch(application.icon) {
      case 'layout-dashboard':
        return <Icons.LayoutDashboard className="h-6 w-6 text-white" />;
      case 'scale':
        return <Icons.Scale className="h-6 w-6 text-white" />;
      case 'activity':
        return <Icons.Activity className="h-6 w-6 text-white" />;
      case 'update':
        return <Icons.RefreshCw className="h-6 w-6 text-white" />; 
      case 'scan':
        return <Icons.ScanLine className="h-6 w-6 text-white" />;
      case 'map-pin':
        return <Icons.MapPin className="h-6 w-6 text-white" />;
      case 'users':
        return <Icons.Users className="h-6 w-6 text-white" />;
      case 'credit-card':
        return <Icons.CreditCard className="h-6 w-6 text-white" />;
      case 'car':
        return <Icons.Car className="h-6 w-6 text-white" />;
      default:
        return <Icons.Webhook className="h-6 w-6 text-white" />;
    }
  };
  
  // Construire l'URL sécurisée via notre proxy d'authentification
  const appUrl = `/proxy/${application.port}`;
  
  return (
    <a 
      href={appUrl} 
      className="group block"
    >
      <Card className="bg-[#1E1E1E] border-none shadow-md transition-all duration-200 transform group-hover:-translate-y-1 group-hover:shadow-lg">
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-[#f89422] rounded-lg flex items-center justify-center mb-4">
            {renderIcon()}
          </div>
          <h3 className="text-lg font-medium text-[#f89422] mb-1">
            {application.name}
          </h3>
          <p className="text-sm text-gray-300">
            {application.description}
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-400">
            <span>Port: {application.port}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
