import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, MenuIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { toast } = useToast();

  const handleHelpClick = () => {
    toast({
      title: "Aide",
      description: "La documentation est en cours de développement.",
      variant: "default",
    });
  };

  return (
    <header className="w-full">
      <div className="relative z-10 flex items-center justify-between h-16 px-4 bg-dark-lighter border-b border-dark-lighter">
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
            className="p-2 text-gray-400 rounded-md hover:text-white hover:bg-dark-lighter"
          >
            <MenuIcon className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex-1 px-4 flex justify-end">
          <div className="ml-4 flex items-center md:ml-6">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleHelpClick}
              className="p-1 rounded-full text-primary hover:text-primary focus:outline-none"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;