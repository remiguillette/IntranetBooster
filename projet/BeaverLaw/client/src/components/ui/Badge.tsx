import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'info' | 'warning' | 'primary';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  // Define colors based on variant
  const colorClasses = {
    success: 'text-success bg-success bg-opacity-10',
    danger: 'text-danger bg-danger bg-opacity-10',
    info: 'text-info bg-info bg-opacity-10',
    warning: 'text-warning bg-warning bg-opacity-10',
    primary: 'text-primary bg-primary bg-opacity-10',
  };

  return (
    <span 
      className={cn(
        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
        colorClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
