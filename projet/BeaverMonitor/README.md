
# Server Monitoring Panel Documentation

## Overview
The Server Monitoring Panel displays real-time information about server status and system resources. It shows:
- Status of multiple server ports (5000-5009)
- CPU and RAM usage per server
- Overall system status including average CPU, RAM usage, and uptime

## Features
- Real-time server status monitoring
- Visual status indicators (online, offline, warning)
- Resource usage metrics (CPU, RAM)
- System-wide statistics
- Auto-refreshing data
- Status rotation for multiple servers

## Technical Setup

### Server Component
1. The server monitoring service is located in `server/services/serverMonitorService.ts`
2. Endpoints exposed:
   - `GET /api/servers/status` - Returns status of all servers
   - `GET /api/system/status` - Returns system-wide metrics

### Client Component
The panel is implemented in `client/src/components/ServerMonitoringPanel.tsx`

### Installation
```bash
npm install
npm run dev
```

The server will start on port 5009.

## Data Structure

### Server Status Response
```typescript
{
  port: number;        // Server port number
  status: string;      // 'online' | 'offline' | 'warning' | 'restarting'
  cpu: number;         // CPU usage percentage
  ram: number;         // RAM usage in MB
}
```

### System Status Response
```typescript
{
  cpuAverage: number;  // Average CPU usage across all servers
  ramAverage: number;  // Average RAM usage in MB
  ramTotal: number;    // Total RAM available in MB
  uptime: number;      // System uptime in seconds
}
```
