import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  Calendar,
  BarChart2,
  Search,
  Menu,
  ArrowUpRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isMobile = useMobile();
  const [location] = useLocation();

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, isOpen]);

  const menuItems = [
    { path: "/", label: "Tableau de bord", icon: Home },
    { path: "/clients", label: "Clients", icon: Users },
    { path: "/documents", label: "Documents", icon: FileText },
    { path: "/calendrier", label: "Calendrier", icon: Calendar },
    { path: "/rapports", label: "Rapports", icon: BarChart2 },
  ];

  if (isMobile && !isOpen) return null;

  return (
    <aside
      className={cn(
        "flex flex-col w-64 bg-surface border-r border-border transition-all z-30",
        isMobile
          ? "fixed inset-0 w-full h-full md:w-64" 
          : "hidden md:flex md:flex-col"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Beavernet</h1>
        <button 
          className="text-muted-foreground hover:text-primary md:hidden"
          onClick={onClose}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Input
            type="text"
            className="w-full bg-accent pl-10 pr-4 text-sm placeholder:text-muted-foreground"
            placeholder="Rechercher..."
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto py-4 px-3">
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <div
                    onClick={isMobile ? onClose : undefined}
                    className={cn(
                      "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      location === item.path
                        ? "bg-accent text-primary"
                        : "hover:bg-accent text-foreground hover:text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </div>
                </Link>
              </li>
            ))}

            <li className="pt-4 mt-4 border-t border-border">
              <a
                href="http://localhost:5000/"
                className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-accent text-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRight className="h-5 w-5 mr-3" />
                Retour Intranet
              </a>
            </li>
          </ul>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <img src="/attached_assets/beaver.png" alt="Beaver" className="h-10 w-10 rounded-full object-cover" />
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">Rémi Guillette</p>
            <p className="text-xs text-muted-foreground">CEO</p>
          </div>
        </div>
      </div>

    </aside>
  );
}