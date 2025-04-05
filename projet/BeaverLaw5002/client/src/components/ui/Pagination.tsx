import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  totalItems,
  itemsPerPage = 10
}) => {
  // Calculate the range of displayed pages
  const visiblePageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const result: (number | 'ellipsis')[] = [1];

    if (currentPage > 3) {
      result.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (currentPage < totalPages - 2) {
      result.push('ellipsis');
    }

    result.push(totalPages);
    return result;
  };

  // Calculate starting and ending item numbers
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className={cn("flex items-center justify-between px-6 py-3 bg-dark-lighter", className)}>
      <div className="flex justify-between flex-1 sm:hidden">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-dark-card rounded-md hover:bg-dark-lighter"
        >
          Précédent
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-dark-card rounded-md hover:bg-dark-lighter"
        >
          Suivant
        </Button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        {totalItems !== undefined && (
          <div>
            <p className="text-sm text-gray-400">
              Affichage de <span className="font-medium">{startItem}</span> à <span className="font-medium">{endItem}</span> sur <span className="font-medium">{totalItems}</span> résultats
            </p>
          </div>
        )}
        
        <div>
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous page button */}
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 bg-dark-card rounded-l-md hover:bg-dark-lighter"
            >
              <span className="sr-only">Précédent</span>
              <i className="fas fa-chevron-left h-5 w-5" aria-hidden="true" />
            </Button>
            
            {/* Page numbers */}
            {visiblePageNumbers().map((pageNumber, index) => (
              pageNumber === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-dark-card"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  disabled={pageNumber === currentPage}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  className={cn(
                    "relative inline-flex items-center px-4 py-2 text-sm font-medium",
                    pageNumber === currentPage
                      ? "text-primary bg-primary bg-opacity-10 hover:bg-opacity-20"
                      : "text-gray-400 bg-dark-card hover:bg-dark-lighter"
                  )}
                >
                  {pageNumber}
                </Button>
              )
            ))}
            
            {/* Next page button */}
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 bg-dark-card rounded-r-md hover:bg-dark-lighter"
            >
              <span className="sr-only">Suivant</span>
              <i className="fas fa-chevron-right h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
