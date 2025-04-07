import { Application } from "@/types/application";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Cat, ScanLine, Users, Signature, Nfc, MonitorCog, IdCard, AppWindow } from "lucide-react";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const renderIcon = () => {
    const iconMap = {
      'BeaverPatch': <LayoutDashboard className="h-6 w-6 text-white" />,
      'BeaverLaw': <Cat className="h-6 w-6 text-white" />,
      'BeaverScanner': <ScanLine className="h-6 w-6 text-white" />,
      'BeavernetCRM': <Users className="h-6 w-6 text-white" />,
      'BeaverDoc': <Signature className="h-6 w-6 text-white" />,
      'BeaverPay': <Nfc className="h-6 w-6 text-white" />,
      'BeaverMonitor': <MonitorCog className="h-6 w-6 text-white" />,
      'BeaverDMV': <IdCard className="h-6 w-6 text-white" />
    };
    
    return iconMap[application.name] || <AppWindow className="h-6 w-6 text-white" />;
  };
  
  // Form URL with port
  // Extract protocol and hostname without port from the current URL
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  // Build URL using the application's specific port
  const appUrl = `${protocol}//${hostname}:${application.port}`;
  
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
