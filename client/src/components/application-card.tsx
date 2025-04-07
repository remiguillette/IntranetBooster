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
  IdCard 
} from "lucide-react";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  // Dictionnaire qui fait correspondre les noms d'icônes aux composants Lucide
  const iconComponents: Record<string, JSX.Element> = {
    LayoutDashboard: <LayoutDashboard className="h-6 w-6 text-white" />,
    Cat: <Cat className="h-6 w-6 text-white" />,
    ScanLine: <ScanLine className="h-6 w-6 text-white" />,
    Users: <Users className="h-6 w-6 text-white" />,
    FileSignature: <FileSignature className="h-6 w-6 text-white" />,
    CreditCard: <CreditCard className="h-6 w-6 text-white" />,
    MonitorDot: <MonitorDot className="h-6 w-6 text-white" />,
    IdCard: <IdCard className="h-6 w-6 text-white" />
  };

  const renderIcon = () => {
    return iconComponents[application.icon] || <MonitorCog className="h-6 w-6 text-white" />;
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
          <div className="w-12 h-12 bg-[#f89422] rounded-lg flex items-center justify-center mb-4">
            {renderIcon()}
          </div>