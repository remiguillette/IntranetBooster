import { storage } from '../storage';
import { ServerStatus, InsertServerStatus, SystemStatus, InsertSystemStatus } from '@shared/schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';
import os from 'os';

const execAsync = promisify(exec);

// Start time of the application to calculate uptime
const startTime = Date.now();

// This service monitors the server ports and system status using real system metrics

export async function monitorServer(): Promise<ServerStatus[]> {
  try {
    // Try to get cached server statuses from storage
    const cachedStatuses = await storage.getAllServerStatuses();
    
    // If there are cached statuses and they're less than 30 seconds old, use them
    if (cachedStatuses.length > 0) {
      const mostRecentStatus = cachedStatuses[0];
      const statusTime = new Date(mostRecentStatus.timestamp).getTime();
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - statusTime;
      
      // If less than 30 seconds old, return cached status
      if (timeElapsed < 30 * 1000) {
        return cachedStatuses;
      }
    }
    
    let portInfos = [];
    try {
      // Get the actual active ports using 'netstat' command
      const { stdout: netstatOutput } = await execAsync('netstat -tlnp 2>/dev/null | grep LISTEN');
      portInfos = parseNetstatOutput(netstatOutput);
    } catch (error) {
      console.error('Error getting port info:', error);
      // Fallback to checking common ports
      portInfos = [
        { port: 3000, pid: process.pid, program: 'node' },
        { port: 3001, pid: process.pid, program: 'node' },
        { port: 5000, pid: process.pid, program: 'node' }
      ];
    }
    
    // Check each port and collect status information
    const serverStatuses: ServerStatus[] = [];
    
    for (const portInfo of portInfos) {
      try {
        const { port, pid, program } = portInfo;
        
        // Get process resource usage
        const processMetrics = await getProcessMetrics(pid);
        
        // Determine status based on resource usage
        let status: 'online' | 'offline' | 'warning' | 'restarting' = 'online';
        
        if (processMetrics.cpu > 75) {
          status = 'warning';
        } else if (processMetrics.cpu === 0) {
          // Check if actually running
          try {
            const { stdout: psOutput } = await execAsync(`ps -p ${pid} -o state=`);
            if (psOutput.trim() === 'D') { // Process in uninterruptible sleep
              status = 'restarting';
            } else if (!psOutput.trim()) {
              status = 'offline';
            }
          } catch (e) {
            status = 'offline';
          }
        }
        
        const serverStatus: InsertServerStatus = {
          port,
          status,
          cpu: processMetrics.cpu,
          ram: processMetrics.ram
        };
        
        // Save to storage
        const savedStatus = await storage.saveServerStatus(serverStatus);
        serverStatuses.push(savedStatus);
      } catch (err) {
        console.error(`Error monitoring port ${portInfo.port}:`, err);
        
        // If there's an error, consider the port offline
        const serverStatus: InsertServerStatus = {
          port: portInfo.port,
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
    
    // If there is a cached status and it's less than 30 seconds old, use it
    if (cachedStatus) {
      const statusTime = new Date(cachedStatus.lastUpdated).getTime();
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - statusTime;
      
      // If less than 30 seconds old, return cached status
      if (timeElapsed < 30 * 1000) {
        return cachedStatus;
      }
    }
    
    // Calculate uptime in seconds
    const uptimeSeconds = Math.floor(os.uptime());
    
    // Get real CPU usage
    const cpuUsage = await getCpuUsage();
    
    // Get real memory usage
    const { totalMemory, usedMemory } = getMemoryUsage();
    
    // Convert to MB
    const ramTotal = Math.round(totalMemory / (1024 * 1024));
    const ramAverage = Math.round(usedMemory / (1024 * 1024));
    
    // Round CPU usage to 1 decimal place
    const cpuAverage = Math.round(cpuUsage * 10) / 10;
    
    const systemStatusData: InsertSystemStatus = {
      cpuAverage,
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

// Parse netstat output to extract port information
function parseNetstatOutput(output: string): Array<{port: number, pid: number, program: string}> {
  const portInfos: Array<{port: number, pid: number, program: string}> = [];
  
  // Split by lines
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      // Example line: tcp        0      0 0.0.0.0:5000            0.0.0.0:*               LISTEN      8734/node
      const parts = line.trim().split(/\s+/);
      
      // Extract port from address part (format: 0.0.0.0:5000)
      const addressPart = parts[3];
      const port = parseInt(addressPart.split(':').pop() || '0', 10);
      
      // Extract PID/Program (format: 8734/node)
      const pidProgramPart = parts[parts.length - 1];
      const pidProgramParts = pidProgramPart.split('/');
      const pid = parseInt(pidProgramParts[0], 10);
      const program = pidProgramParts[1] || 'unknown';
      
      if (port && pid) {
        portInfos.push({ port, pid, program });
      }
    } catch (e) {
      console.error('Error parsing netstat line:', line, e);
    }
  }
  
  return portInfos;
}

// Get CPU and memory usage for a specific process
async function getProcessMetrics(pid: number): Promise<{cpu: number, ram: number}> {
  try {
    // Get CPU usage using 'ps' command
    const { stdout: psOutput } = await execAsync(`ps -p ${pid} -o %cpu,%mem | tail -n 1`);
    const [cpuStr, memStr] = psOutput.trim().split(/\s+/);
    const cpu = parseFloat(cpuStr);
    
    // Get memory usage in KB using 'ps' command
    const { stdout: memOutput } = await execAsync(`ps -p ${pid} -o rss | tail -n 1`);
    // Convert KB to MB
    const ram = Math.round(parseInt(memOutput.trim(), 10) / 1024);
    
    return { cpu, ram };
  } catch (e) {
    console.error(`Failed to get metrics for PID ${pid}:`, e);
    return { cpu: 0, ram: 0 };
  }
}

// Get system-wide CPU usage
async function getCpuUsage(): Promise<number> {
  try {
    // Get average system load (1, 5, 15 minute averages)
    const loadAvg = os.loadavg();
    // Use 1-minute load average and normalize by CPU count
    const cpuCount = os.cpus().length;
    const normalizedLoad = (loadAvg[0] / cpuCount) * 100;
    
    // Ensure value is between 0 and 100
    return Math.min(Math.max(normalizedLoad, 0), 100);
  } catch (e) {
    console.error('Failed to get CPU usage:', e);
    return 0;
  }
}

// Get system-wide memory usage
function getMemoryUsage(): {totalMemory: number, usedMemory: number} {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  
  return { totalMemory, usedMemory };
}
