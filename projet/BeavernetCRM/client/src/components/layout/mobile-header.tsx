import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
  const isMobile = useMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-20">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-primary">Beavernet</h1>
        <Button
          variant="ghost"
          className="p-1 text-muted-foreground hover:text-primary"
          onClick={onOpenSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
