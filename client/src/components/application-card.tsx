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
      case 'bar-chart-3':
        return <Icons.BarChart3 className="h-6 w-6 text-white" />;
      case 'calendar':
        return <Icons.Calendar className="h-6 w-6 text-white" />;
      case 'mail':
        return <Icons.Mail className="h-6 w-6 text-white" />;
      case 'users':
        return <Icons.Users className="h-6 w-6 text-white" />;
      case 'file-text':
        return <Icons.FileText className="h-6 w-6 text-white" />;
      case 'video':
        return <Icons.Video className="h-6 w-6 text-white" />;
      default:
        return <Icons.Webhook className="h-6 w-6 text-white" />;
    }
  };
  
  // Form URL with port
  // Use the full origin (protocol + hostname + port) as the base URL
  // This ensures we connect to the correct domain regardless of how the app is hosted
  const baseUrl = window.location.origin;
  const appUrl = `${baseUrl}/app/${application.id}`;
  
  return (
    <a 
      href={appUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
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
