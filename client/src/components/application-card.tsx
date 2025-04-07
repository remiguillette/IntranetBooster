
import { Application } from "@/types/application";
import { Card, CardContent } from "@/components/ui/card";

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const appUrl = `${protocol}//${hostname}:${application.port}`;

  return (
    <a 
      href={appUrl} 
      className="block transition-transform duration-200 hover:-translate-y-1"
    >
      <Card className="h-full bg-[#1E1E1E] border-none shadow-md hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[#f89422] flex items-center justify-center text-white font-semibold">
              {application.name.substring(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{application.name}</h3>
              <p className="text-sm text-gray-400">{application.description}</p>
              <p className="text-xs text-gray-500 mt-2">Port: {application.port}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
