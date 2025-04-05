
import React from 'react';
import beaverImage from '@assets/beaver.png';

export const PoliceBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 2L9 7L3 8.5L7 13L6 19L12 16L18 19L17 13L21 8.5L15 7L12 2Z" />
    <circle cx="12" cy="11" r="3" />
  </svg>
);

export const AnimalIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2c-1.43 0-2.8.5-3.9 1.4-1.08.9-1.84 2.14-2.15 3.6-.15.76-.15 1.54 0 2.3.17.86.52 1.68 1.05 2.4M8.5 9C7.13 9 6 10.13 6 11.5V14h12v-2.5c0-1.37-1.13-2.5-2.5-2.5" />
    <path d="M19 14.5a3.5 3.5 0 0 1-7 0M15.5 4c1.2 0 2.4.5 3.35 1.45S20.3 7.6 20.3 8.8c0 .65-.5 1.2-1.2 1.2M4 22l3-9h2M7 13H5.5v7.5M18 22l-3-9h-2M15 13h1.5v7.5" />
  </svg>
);

export const BeaverIcon = ({ className = "w-6 h-6", asProfile = false }: { className?: string, asProfile?: boolean }) => {
  return (
    <div className={`${className} ${asProfile ? 'ring-2 ring-primary/20 rounded-full overflow-hidden' : ''}`}>
      <img 
        src={beaverImage} 
        alt="Beaver Logo" 
        className={`w-full h-full ${asProfile ? 'object-cover' : 'object-contain'}`}
      />
    </div>
  );
};

export const DeerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 3h1m9 0h1M8 3v8m8-8v8M4 11h16M12 11v10M7 16h10M5 21h3m8 0h3" />
  </svg>
);

export const BearIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="7" r="2" />
    <circle cx="15" cy="7" r="2" />
    <path d="M8 14h8M12 12v4M12 2C6.5 2 2 6.5 2 12c0 5 4 10 10 10s10-5 10-10c0-5.5-4.5-10-10-10z" />
  </svg>
);

export const FoxIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 21l4-9 3 4.5L16 12l4 9M8 5l3 5 2-6 2 6 3-5M7 3h10M7 21h10" />
  </svg>
);

export const WolfIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2c-3.87 0-7 3.13-7 7 0 2.2 1.02 4.14 2.6 5.4L12 22l4.4-7.6c1.58-1.25 2.6-3.2 2.6-5.4 0-3.87-3.13-7-7-7z" />
    <circle cx="10" cy="7" r="1" />
    <circle cx="14" cy="7" r="1" />
    <path d="M9 11h6M12 11v3" />
  </svg>
);
