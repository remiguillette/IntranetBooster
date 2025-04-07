
import { Application } from "@/types/application";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard,
  Cat, 
  ScanLine, 
  Users, 
  FileSignature,
  CreditCard,
  MonitorDot,
  IdCard,
  MonitorCog
} from "lucide-react";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const getIcon = () => {
    switch (application.icon) {
      case "LayoutDashboard":
        return <LayoutDashboard className="h-6 w-6 text-white" />;
      case "Cat":
        return <Cat className="h-6 w-6 text-white" />;
      case "ScanLine":
        return <ScanLine className="h-6 w-6 text-white" />;
      case "Users":
        return <Users className="h-6 w-6 text-white" />;
      case "FileSignature":
        return <FileSignature className="h-6 w-6 text-white" />;
      case "CreditCard":
        return <CreditCard className="h-6 w-6 text-white" />;
      case "MonitorDot":
        return <MonitorDot className="h-6 w-6 text-white" />;
      case "IdCard":
        return <IdCard className="h-6 w-6 text-white" />;
      default:
        return <MonitorCog className="h-6 w-6 text-white" />;
    }
  };

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const appUrl = `${protocol}//${hostname}:${application.port}`;

  return (
    <a 
      href={appUrl} 
      className="group block"
    >
      <Card className="bg-[#1E1E1E] border-none shadow-md transition-all duration-200 transform group-hover:-translate-y-1 group-hover:shadow-lg">
        <CardContent className="p-6">
          
          <h3 className="text-lg font-semibold text-white mb-1">{application.name}</h3>
          <p className="text-sm text-gray-400">{application.description}</p>
          <p className="text-xs text-gray-500 mt-2">Port: {application.port}</p>
        </CardContent>
      </Card>
    </a>
  );
}
