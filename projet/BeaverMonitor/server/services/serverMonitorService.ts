import { storage } from '../storage';
import { ServerStatus, InsertServerStatus, SystemStatus, InsertSystemStatus } from '@shared/schema';
import os from 'os';

// Start time of the application to calculate uptime
const startTime = Date.now();

// Mock data generation
function generateMockServerStatus(port: number): InsertServerStatus {
  const statuses: ('online' | 'warning' | 'offline')[] = ['online', 'online', 'online', 'warning'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    port,
    status,
    cpu: status === 'warning' ? 75 + Math.random() * 20 : Math.random() * 60,
    ram: Math.floor(Math.random() * 512)
  };
}

export async function monitorServer(): Promise<ServerStatus[]> {
  try {
    // Simulated ports to monitor
    const ports = [3000, 5000, 8080, 9000];
    const serverStatuses: ServerStatus[] = [];

    for (const port of ports) {
      const serverStatus = generateMockServerStatus(port);
      const savedStatus = await storage.saveServerStatus(serverStatus);
      serverStatuses.push(savedStatus);
    }

    return serverStatuses;
  } catch (error) {
    console.error('Error in monitorServer:', error);
    throw new Error('Erreur lors de la surveillance des serveurs');
  }
}

export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    // Generate simulated system metrics
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const cpuAverage = 25 + Math.random() * 30;
    const ramTotal = 16384; // 16GB in MB
    const ramAverage = Math.floor(ramTotal * (0.3 + Math.random() * 0.4));

    const systemStatusData: InsertSystemStatus = {
      cpuAverage,
      ramAverage,
      ramTotal,
      uptime
    };

    return await storage.saveSystemStatus(systemStatusData);
  } catch (error) {
    console.error('Error in getSystemStatus:', error);
    throw new Error('Erreur lors de la récupération du statut du système');
  }
}