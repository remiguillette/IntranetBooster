import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface PageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  buttonLabel?: string;
  buttonIcon?: string;
  buttonLink?: string;
  onSearch?: (query: string) => void;
  onButtonClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  searchPlaceholder = "Rechercher...",
  buttonLabel,
  buttonIcon = "fas fa-plus",
  buttonLink,
  onSearch,
  onButtonClick
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-primary font-montserrat mb-4 sm:mb-0">{title}</h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <SearchBar
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          className="w-full sm:w-64"
        />
        
        {buttonLabel && (
          buttonLink ? (
            <div
              onClick={() => window.location.href = buttonLink}
              className="w-full sm:w-auto cursor-pointer"
            >
              <Button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90 focus:outline-none">
                <i className={`${buttonIcon} mr-2`}></i>{buttonLabel}
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-opacity-90 focus:outline-none"
              onClick={onButtonClick}
            >
              <i className={`${buttonIcon} mr-2`}></i>{buttonLabel}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default PageHeader;
