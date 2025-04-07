import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Rechercher...",
  value,
  onChange,
  onSearch,
  className = ""
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 py-2 bg-dark-lighter border border-dark-lighter rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {onSearch && (
        <Button 
          onClick={onSearch}
          variant="outline" 
          className="ml-2 px-4 text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none"
        >
          Rechercher
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
