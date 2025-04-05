import { FC, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminDashboard } from '@/components/admin/dashboard';
import { useQuery } from '@tanstack/react-query';

const AdminDashboardPage: FC = () => {
  const [, navigate] = useLocation();

  // Check if admin is authenticated
  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ['/api/admin/check-auth'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/admin/check-auth');
        if (!res.ok) return false;
        return await res.json();
      } catch (error) {
        return false;
      }
    }
  });

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && isAuthenticated === false) {
      navigate('/admin');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Only render dashboard if authenticated
  return isAuthenticated ? <AdminDashboard /> : null;
};

export default AdminDashboardPage;