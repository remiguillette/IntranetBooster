import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-dark text-textLight">
      <Sidebar isMobileOpen={isMobileMenuOpen} onCloseMobile={closeMobileMenu} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuClick={toggleMobileMenu} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
