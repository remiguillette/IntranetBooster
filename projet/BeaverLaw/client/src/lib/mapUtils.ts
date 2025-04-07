// Map utils for Leaflet integration with lost/found animals

import L from 'leaflet';
import { LostFoundAnimal } from '@shared/schema';

// Define map bounds for Quebec region
export const QUEBEC_BOUNDS = {
  southwest: { lat: 45.0, lng: -75.0 },
  northeast: { lat: 52.0, lng: -60.0 }
};

export const DEFAULT_CENTER = { lat: 46.8, lng: -71.2 }; // Quebec City

// Helper to create a marker for a lost/found animal
export const createMarker = (animal: LostFoundAnimal) => {
  const coordinates = animal.locationCoordinates as { lat: number; lng: number };
  
  if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
    return null;
  }
  
  // Create marker with custom icon based on animal type
  const icon = L.divIcon({
    className: animal.type === 'lost' ? 'lost-animal-marker' : 'found-animal-marker',
    html: `<div class="marker-icon ${animal.type === 'lost' ? 'bg-danger' : 'bg-success'}">
      <i class="fas fa-paw text-white"></i>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return L.marker([coordinates.lat, coordinates.lng], { icon });
};

// Generate popup content for a marker
export const createPopupContent = (animal: LostFoundAnimal) => {
  const dateFormatted = new Date(animal.reportDate).toLocaleDateString('fr-FR');
  
  return `
    <div class="map-popup">
      <h3 class="font-bold">${animal.species} - ${animal.type === 'lost' ? 'Perdu' : 'Trouvé'}</h3>
      <p>${animal.description}</p>
      <p class="text-xs mt-1">Signalé le: ${dateFormatted}</p>
      <p class="text-xs">${animal.location}</p>
      <div class="text-center mt-2">
        <a href="/lost-found/${animal.id}" class="text-primary hover:underline">Voir les détails</a>
      </div>
    </div>
  `;
};

// Calculate approximate time since report
export const getTimeSince = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return "Il y a moins d'une minute";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes}m`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `Il y a ${days}j`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `Il y a ${months} mois`;
  
  const years = Math.floor(days / 365);
  return `Il y a ${years} ans`;
};
