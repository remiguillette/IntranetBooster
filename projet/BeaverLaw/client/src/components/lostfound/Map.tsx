import React, { useEffect, useState, useRef } from 'react';
import L, { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_CENTER, QUEBEC_BOUNDS } from '@/lib/mapUtils';

interface MapProps {
  markers?: Array<{
    position: { lat: number; lng: number };
    popup?: string;
    icon?: L.DivIcon;
  }>;
  onClick?: (lat: number, lng: number) => void;
  initialMarker?: { lat: number; lng: number };
  center?: { lat: number; lng: number };
  zoom?: number;
}

const MapComponent: React.FC<MapProps> = ({
  markers = [],
  onClick,
  initialMarker,
  center = DEFAULT_CENTER,
  zoom = 10
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);
    leafletMapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add initial marker if provided
    if (initialMarker) {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-icon bg-primary" style="background-color: #f89422;">
                <i class="fas fa-map-marker-alt text-white"></i>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      markerRef.current = L.marker([initialMarker.lat, initialMarker.lng], { icon })
        .addTo(map);
    }

    // Add click handler
    if (onClick) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onClick(lat, lng);

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon bg-primary" style="background-color: #f89422;">
                    <i class="fas fa-map-marker-alt text-white"></i>
                  </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });

          markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        }
      });
    }

    // Set Quebec bounds
    if (QUEBEC_BOUNDS) {
      const bounds = L.latLngBounds(
        [QUEBEC_BOUNDS.southwest.lat, QUEBEC_BOUNDS.southwest.lng],
        [QUEBEC_BOUNDS.northeast.lat, QUEBEC_BOUNDS.northeast.lng]
      );
      map.setMaxBounds(bounds);
    }

    // Clean up
    return () => {
      map.remove();
      leafletMapRef.current = null;
      markerRef.current = null;
    };
  }, [center, zoom]);

  // Add markers from props
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Create a collection to store markers for cleanup
    const markerInstances: L.Marker[] = [];

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Re-add the user's clicked marker if it exists
    if (markerRef.current) {
      markerRef.current.addTo(map);
    }

    // Add all markers from props
    markers.forEach((marker) => {
      const { position, popup, icon } = marker;
      
      const defaultIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-icon bg-primary" style="background-color: #f89422;">
                <i class="fas fa-paw text-white"></i>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      
      const markerInstance = L.marker([position.lat, position.lng], { 
        icon: icon || defaultIcon 
      }).addTo(map);
      
      // Store reference for cleanup
      markerInstances.push(markerInstance);
      
      if (popup) {
        markerInstance.bindPopup(popup);
      }
    });

    // Panel to Quebec City if no markers
    if (markers.length === 0 && center) {
      map.setView([center.lat, center.lng], zoom);
    }

    // Clean up markers on component unmount
    return () => {
      markerInstances.forEach(marker => {
        if (map) marker.removeFrom(map);
      });
    };
  }, [markers, center, zoom]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
