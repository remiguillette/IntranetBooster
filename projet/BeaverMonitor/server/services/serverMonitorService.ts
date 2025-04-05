import { storage } from '../storage';
import { ServerStatus, InsertServerStatus, SystemStatus, InsertSystemStatus } from '@shared/schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';

const execAsync = promisify(exec);

// Start time of the application to calculate uptime
const startTime = Date.now();

// This service monitors the server ports and system status
// In a real application, this would connect to actual servers and collect real metrics

export async function monitorServer(): Promise<ServerStatus[]> {
  try {
    // Try to get cached server statuses from storage
    const cachedStatuses = await storage.getAllServerStatuses();
    
    // If there are cached statuses and they're less than 1 minute old, use them
    if (cachedStatuses.length > 0) {
      const mostRecentStatus = cachedStatuses[0];
      const statusTime = new Date(mostRecentStatus.timestamp).getTime();
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - statusTime;
      
      // If less than 1 minute old, return cached status
      if (timeElapsed < 60 * 1000) {
        return cachedStatuses;
      }
    }
    
    // List of ports to monitor (5000-5009)
    const ports = [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009];
    
    // Check each port and collect status information
    const serverStatuses: ServerStatus[] = [];
    
    for (const port of ports) {
      try {
        // Try to ping the port to see if it's up
        const isPortAvailable = await checkPort(port);
        
        // Generate some realistic metrics
        let status: 'online' | 'offline' | 'warning' | 'restarting';
        let cpu: number;
        let ram: number;
        
        if (!isPortAvailable) {
          // Port is offline
          status = 'offline';
          cpu = 0;
          ram = 0;
        } else if (port === 5002) {
          // Simulate high load on port 5002
          status = 'warning';
          cpu = Math.floor(Math.random() * 25) + 75; // 75-100%
          ram = 1200; // 1.2GB
        } else if (port === 5007) {
          // Simulate restarting state on port 5007
          status = 'restarting';
          cpu = Math.floor(Math.random() * 30) + 30; // 30-60%
          ram = 768; // 768MB
        } else if (port === 5004) {
          // Simulate offline state on port 5004
          status = 'offline';
          cpu = 0;
          ram = 0;
        } else {
          // Normal operational state
          status = 'online';
          cpu = Math.floor(Math.random() * 30) + 1; // 1-30%
          ram = Math.floor(Math.random() * 5) + 3; // 3-8 * 64MB
          ram = ram * 64; // 192MB-512MB
        }
        
        const serverStatus: InsertServerStatus = {
          port,
          status,
          cpu,
          ram
        };
        
        // Save to storage
        const savedStatus = await storage.saveServerStatus(serverStatus);
        serverStatuses.push(savedStatus);
      } catch (err) {
        console.error(`Error monitoring port ${port}:`, err);
        
        // If there's an error, consider the port offline
        const serverStatus: InsertServerStatus = {
          port,
          status: 'offline',
          cpu: 0,
          ram: 0
        };
        
        const savedStatus = await storage.saveServerStatus(serverStatus);
        serverStatuses.push(savedStatus);
      }
    }
    
    return serverStatuses;
  } catch (error) {
    console.error('Error in monitorServer:', error);
    throw new Error('Erreur lors de la surveillance des serveurs');
  }
}

export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    // Try to get cached system status from storage
    const cachedStatus = await storage.getLatestSystemStatus();
    
    // If there is a cached status and it's less than 1 minute old, use it
    if (cachedStatus) {
      const statusTime = new Date(cachedStatus.lastUpdated).getTime();
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - statusTime;
      
      // If less than 1 minute old, return cached status
      if (timeElapsed < 60 * 1000) {
        return cachedStatus;
      }
    }
    
    // Calculate uptime in seconds
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    // Get all active server statuses
    const serverStatuses = await storage.getAllServerStatuses();
    const activeServers = serverStatuses.filter(s => s.status !== 'offline');
    
    // Calculate average CPU and RAM usage
    const cpuValues = activeServers.map(s => s.cpu);
    const ramValues = activeServers.map(s => s.ram);
    
    const cpuAverage = cpuValues.length > 0 
      ? cpuValues.reduce((sum, val) => sum + val, 0) / cpuValues.length 
      : 0;
    
    const ramAverage = ramValues.length > 0 
      ? Math.floor(ramValues.reduce((sum, val) => sum + val, 0) / ramValues.length) 
      : 0;
    
    // Total RAM allocation (2GB)
    const ramTotal = 2048; // MB
    
    const systemStatusData: InsertSystemStatus = {
      cpuAverage: Math.round(cpuAverage * 10) / 10, // Round to 1 decimal place
      ramAverage,
      ramTotal,
      uptime: uptimeSeconds
    };
    
    // Save to storage
    const savedStatus = await storage.saveSystemStatus(systemStatusData);
    
    return savedStatus;
  } catch (error) {
    console.error('Error in getSystemStatus:', error);
    throw new Error('Erreur lors de la récupération du statut du système');
  }
}

// Function to check if a port is available/listening
async function checkPort(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const socket = http.get({
      hostname: 'localhost',
      port,
      path: '/',
      timeout: 1000
    })
    .on('response', () => {
      socket.destroy();
      resolve(true);
    })
    .on('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}
