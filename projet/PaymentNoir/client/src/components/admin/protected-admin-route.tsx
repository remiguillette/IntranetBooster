import { FC, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export const ProtectedAdminRoute: FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [, navigate] = useLocation();
  
  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ['/api/admin/check-auth'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/admin/check-auth');
        if (!res.ok) return false;
        const data = await res.json();
        return data.authenticated;
      } catch (error) {
        return false;
      }
    }
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated === false) {
      navigate('/admin');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedAdminRoute;