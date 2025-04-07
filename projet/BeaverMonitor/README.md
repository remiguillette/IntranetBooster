# Server Monitoring Panel Documentation

## Overview
The Server Monitoring Panel displays real-time information about actual server status and system resources. It shows:
- Status of all actively listening ports on the system
- Real CPU and RAM usage per server process
- Actual system status including average CPU, RAM usage, and uptime

## Features
- Real-time server monitoring of actual system ports
- Visual status indicators based on real process state (online, offline, warning, restarting)
- Accurate resource usage metrics (CPU, RAM) from running processes
- System-wide statistics from the operating system
- Auto-refreshing data (every 30 seconds)
- Status rotation for multiple servers

## Technical Implementation

### Server Component
1. The server monitoring service is located in `server/services/serverMonitorService.ts`
2. Implementation:
   - Uses `netstat` to detect all active ports on the system
   - Retrieves actual process information (PID, program name)
   - Monitors real CPU and memory usage with `ps` command
   - Collects system-wide metrics using Node.js os module
3. Endpoints exposed:
   - `GET /api/servers/status` - Returns status of all actual servers
   - `GET /api/system/status` - Returns real system-wide metrics

### Client Component
The panel is implemented in `client/src/components/ServerMonitoringPanel.tsx`

### Installation
```bash
npm install
npm run dev
```

The server will start on the designated port.

## Data Structure

### Server Status Response (Real Server Data)
```typescript
{
  port: number;        // Actual server port number
  status: string;      // 'online' | 'offline' | 'warning' | 'restarting'
  cpu: number;         // Real CPU usage percentage
  ram: number;         // Actual RAM usage in MB
}
```

### System Status Response (Real System Data)
```typescript
{
  cpuAverage: number;  // Real average CPU usage across the system
  ramAverage: number;  // Actual RAM usage in MB
  ramTotal: number;    // Total RAM available in MB
  uptime: number;      // Real system uptime in seconds
}
```