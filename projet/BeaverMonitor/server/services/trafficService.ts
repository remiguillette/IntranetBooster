import axios from 'axios';
import { TrafficIncident, InsertTrafficIncident } from '@shared/schema';
import { storage } from '../storage';

interface TrafficData {
  region: string;
  incidents: TrafficIncident[];
}

// Since we don't have access to an actual traffic API, this service
// will simulate traffic data based on common patterns and random incidents
// In a real application, this would connect to a traffic API

export async function fetchTrafficData(region: string): Promise<TrafficData> {
  try {
    // Try to get cached incidents from storage first
    const cachedIncidents = await storage.getTrafficIncidentsByRegion(region);
    
    // If there are cached incidents and they're less than 10 minutes old, use them
    if (cachedIncidents.length > 0) {
      const mostRecentIncident = cachedIncidents[0];
      const incidentTime = new Date(mostRecentIncident.timestamp).getTime();
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - incidentTime;
      
      // If less than 10 minutes old, return cached incidents
      if (timeElapsed < 10 * 60 * 1000) {
        return {
          region,
          incidents: cachedIncidents
        };
      }
    }
    
    // Otherwise, simulate fetching new data (in a real app, this would be an API call)
    // Generate some realistic traffic incidents for the given region
    const incidents = await simulateTrafficIncidents(region);
    
    // Save the incidents to storage
    for (const incident of incidents) {
      await storage.createTrafficIncident(incident);
    }
    
    return {
      region,
      incidents
    };
  } catch (error) {
    console.error(`Error fetching traffic data for ${region}:`, error);
    throw new Error(`Erreur lors de la récupération des données de circulation pour ${region}`);
  }
}

async function simulateTrafficIncidents(region: string): Promise<TrafficIncident[]> {
  // This function simulates traffic incidents based on the region
  // In a real app, this would fetch data from a traffic API
  
  // Define some common locations and incident types for each region
  const regionLocations: Record<string, string[]> = {
    'GTA Toronto': [
      'Autoroute 401 - Direction Ouest',
      'Autoroute 401 - Direction Est',
      'Gardiner Expressway',
      'Don Valley Parkway',
      'Autoroute 427 - Direction Nord',
      'Autoroute 427 - Direction Sud'
    ],
    'Toronto': [
      'Queen Street',
      'King Street',
      'Yonge Street',
      'Bloor Street',
      'Dundas Square',
      'Avenue Road'
    ],
    'Hamilton': [
      'Autoroute QEW - Direction Est',
      'Autoroute QEW - Direction Ouest',
      'Main Street',
      'King Street',
      'James Street North',
      'Mohawk Road'
    ],
    'Niagara Region': [
      'Autoroute QEW - Direction Ouest',
      'Autoroute QEW - Direction Est',
      'Autoroute 420',
      'Lundy\'s Lane',
      'Stanley Avenue',
      'Niagara Parkway'
    ]
  };
  
  const incidentTypes = ['accident', 'construction', 'congestion', 'info'];
  const severityTypes = ['danger', 'warning', 'success'];
  
  const incidentDescriptions: Record<string, string[]> = {
    'accident': [
      'Accident impliquant plusieurs véhicules. Retard estimé: 30 min.',
      'Accident majeur. Retard estimé: 25 min.',
      'Collision entre deux véhicules. Retard estimé: 15 min.',
      'Accident mineur. Retard estimé: 10 min.'
    ],
    'construction': [
      'Travaux routiers. Voie de droite fermée.',
      'Fermeture de rue pour travaux de construction.',
      'Travaux routiers. Circulation ralentie.',
      'Construction de pont. Détour obligatoire.'
    ],
    'congestion': [
      'Congestion due au volume de trafic. Retard estimé: 15 min.',
      'Trafic dense. Retard estimé: 10 min.',
      'Congestion près du pont. Retard estimé: 10 min.',
      'Embouteillage. Prévoyez du temps supplémentaire.'
    ],
    'info': [
      'Circulation fluide. Aucun retard signalé.',
      'Événement spécial. Prévoyez des routes alternatives.',
      'Patrouille de police active. Respectez les limites de vitesse.',
      'Conditions routières normales.'
    ]
  };
  
  // Generate 1-4 incidents for the region
  const numIncidents = Math.floor(Math.random() * 4) + 1;
  const incidents: TrafficIncident[] = [];
  
  for (let i = 0; i < numIncidents; i++) {
    const locations = regionLocations[region] || [];
    if (locations.length === 0) continue;
    
    const randomLocationIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomLocationIndex];
    
    const randomTypeIndex = Math.floor(Math.random() * incidentTypes.length);
    const type = incidentTypes[randomTypeIndex] as 'accident' | 'construction' | 'congestion' | 'info';
    
    let severity: 'danger' | 'warning' | 'success';
    
    // Set severity based on incident type
    if (type === 'accident') {
      severity = 'danger';
    } else if (type === 'construction' || type === 'congestion') {
      severity = 'warning';
    } else {
      severity = 'success';
    }
    
    const descriptions = incidentDescriptions[type] || [];
    const randomDescIndex = Math.floor(Math.random() * descriptions.length);
    const description = descriptions[randomDescIndex];
    
    const incident: InsertTrafficIncident = {
      region,
      location,
      description,
      type,
      severity
    };
    
    // Add to the simulated response with an assigned ID
    incidents.push({
      ...incident,
      id: i + 1,
      timestamp: new Date().toISOString()
    } as TrafficIncident);
  }
  
  return incidents;
}
