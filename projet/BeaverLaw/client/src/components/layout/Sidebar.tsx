import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { BeaverIcon } from '@/lib/icons';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, children, isActive }) => {
  const [, setLocation] = useLocation();
  
  return (
    <div
      onClick={() => setLocation(href)}
      className={cn(
        "sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-md group cursor-pointer",
        isActive
          ? "bg-gray-800 border-l-4 border-gray-500"
          : "hover:bg-dark-lighter"
      )}
    >
      <div className={cn("w-6 h-6 mr-3", isActive ? "text-white" : "text-gray-300")}>
        {icon}
      </div>
      <span className={isActive ? "font-bold text-white" : "text-gray-100"}>{children}</span>
    </div>
  );
};

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const [location] = useLocation();

  return (
    <div 
      className={cn(
        "md:flex md:flex-shrink-0 transition-all duration-300 ease-in-out",
        isMobileOpen ? "block absolute top-16 left-0 right-0 bottom-0 z-20" : "hidden"
      )}
    >
      <div className="flex flex-col w-64 bg-dark">
        <div className="flex items-center justify-center h-16 px-4 py-5 bg-dark">
          <div className="flex items-center space-x-2">
            <BeaverIcon className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold tracking-wider text-primary font-montserrat">BEAVERLAW</h1>
          </div>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-2">
            <SidebarItem
              href="/"
              icon={<i className="fas fa-tachometer-alt"></i>}
              isActive={location === '/'}
            >
              Tableau de Bord
            </SidebarItem>
            <SidebarItem
              href="/agents"
              icon={<i className="fas fa-users"></i>}
              isActive={location === '/agents'}
            >
              Gestion des Agents
            </SidebarItem>
            <SidebarItem
              href="/animals"
              icon={<i className="fas fa-paw"></i>}
              isActive={location === '/animals'}
            >
              Gestion des Animaux
            </SidebarItem>
            <SidebarItem
              href="/lost-found"
              icon={<i className="fas fa-search"></i>}
              isActive={location === '/lost-found'}
            >
              Animaux Perdus/Trouvés
            </SidebarItem>
            <SidebarItem
              href="/wanted"
              icon={<i className="fas fa-exclamation-triangle"></i>}
              isActive={location === '/wanted'}
            >
              Avis de Recherche
            </SidebarItem>
            <SidebarItem
              href="/regulations"
              icon={<i className="fas fa-clipboard-list"></i>}
              isActive={location === '/regulations'}
            >
              Application des Règlements
            </SidebarItem>
          </nav>
          <div className="p-4 mt-auto border-t border-dark-lighter">
            <div className="flex items-center">
              <BeaverIcon className="w-10 h-10" asProfile={true} />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Rémi Guillette Agent</p>
                <p className="text-xs text-primary">En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Backdrop for mobile to close sidebar */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={onCloseMobile}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
