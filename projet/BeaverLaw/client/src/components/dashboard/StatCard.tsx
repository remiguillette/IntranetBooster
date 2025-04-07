import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className = ""
}) => {
  // Determine change direction style
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;
  
  const changeColorClass = isPositiveChange 
    ? 'text-success' 
    : isNegativeChange 
      ? 'text-danger' 
      : 'text-gray-400';

  return (
    <Card className={cn("transition-all duration-200 bg-dark-card hover:transform hover:-translate-y-1 hover:shadow-lg shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-primary">{value}</p>
          </div>
          <div className="p-3 text-white bg-primary bg-opacity-20 rounded-full">
            {icon}
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center mt-4 text-sm">
            <span className={cn("flex items-center", changeColorClass)}>
              {isPositiveChange && <i className="fas fa-arrow-up mr-1 text-xs"></i>}
              {isNegativeChange && <i className="fas fa-arrow-down mr-1 text-xs"></i>}
              {Math.abs(change)}%
            </span>
            <span className="ml-2 text-gray-400">Depuis le mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
