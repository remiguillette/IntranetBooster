
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
              {application.name === "BeaverLaw" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cat"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>
              ) : (
                application.name.substring(0, 2)
              )}
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
