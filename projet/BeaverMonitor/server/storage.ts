import { users, type User, type InsertUser, 
  WeatherAlert, InsertWeatherAlert, 
  ServerStatus, InsertServerStatus,
  TrafficIncident, InsertTrafficIncident,
  WeatherData, InsertWeatherData,
  SystemStatus, InsertSystemStatus
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Weather methods
  getWeatherDataByCity(city: string): Promise<WeatherData | undefined>;
  saveWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  
  // Weather alerts methods
  createWeatherAlert(alert: InsertWeatherAlert): Promise<WeatherAlert>;
  getActiveWeatherAlerts(): Promise<WeatherAlert[]>;
  deactivateWeatherAlert(id: number): Promise<void>;
  
  // Server status methods
  saveServerStatus(status: InsertServerStatus): Promise<ServerStatus>;
  getServerStatusByPort(port: number): Promise<ServerStatus | undefined>;
  getAllServerStatuses(): Promise<ServerStatus[]>;
  
  // System status methods
  saveSystemStatus(status: InsertSystemStatus): Promise<SystemStatus>;
  getLatestSystemStatus(): Promise<SystemStatus | undefined>;
  
  // Traffic incidents methods
  createTrafficIncident(incident: InsertTrafficIncident): Promise<TrafficIncident>;
  getTrafficIncidentsByRegion(region: string): Promise<TrafficIncident[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private weatherAlerts: Map<number, WeatherAlert>;
  private serverStatuses: Map<number, ServerStatus>;
  private trafficIncidents: Map<number, TrafficIncident>;
  private weatherData: Map<number, WeatherData>;
  private systemStatuses: Map<number, SystemStatus>;
  
  private nextUserId: number;
  private nextWeatherAlertId: number;
  private nextServerStatusId: number;
  private nextTrafficIncidentId: number;
  private nextWeatherDataId: number;
  private nextSystemStatusId: number;

  constructor() {
    this.users = new Map();
    this.weatherAlerts = new Map();
    this.serverStatuses = new Map();
    this.trafficIncidents = new Map();
    this.weatherData = new Map();
    this.systemStatuses = new Map();
    
    this.nextUserId = 1;
    this.nextWeatherAlertId = 1;
    this.nextServerStatusId = 1;
    this.nextTrafficIncidentId = 1;
    this.nextWeatherDataId = 1;
    this.nextSystemStatusId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Weather methods
  async getWeatherDataByCity(city: string): Promise<WeatherData | undefined> {
    return Array.from(this.weatherData.values()).find(
      (data) => data.city === city,
    );
  }
  
  async saveWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const id = this.nextWeatherDataId++;
    const weatherData: WeatherData = { ...data, id };
    this.weatherData.set(id, weatherData);
    return weatherData;
  }
  
  // Weather alerts methods
  async createWeatherAlert(alert: InsertWeatherAlert): Promise<WeatherAlert> {
    const id = this.nextWeatherAlertId++;
    const weatherAlert: WeatherAlert = { 
      ...alert, 
      id, 
      timestamp: new Date().toISOString() 
    };
    this.weatherAlerts.set(id, weatherAlert);
    return weatherAlert;
  }
  
  async getActiveWeatherAlerts(): Promise<WeatherAlert[]> {
    return Array.from(this.weatherAlerts.values())
      .filter(alert => alert.active)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async deactivateWeatherAlert(id: number): Promise<void> {
    const alert = this.weatherAlerts.get(id);
    if (alert) {
      alert.active = false;
      this.weatherAlerts.set(id, alert);
    }
  }
  
  // Server status methods
  async saveServerStatus(status: InsertServerStatus): Promise<ServerStatus> {
    const id = this.nextServerStatusId++;
    const serverStatus: ServerStatus = { 
      ...status, 
      id, 
      timestamp: new Date().toISOString() 
    };
    this.serverStatuses.set(id, serverStatus);
    return serverStatus;
  }
  
  async getServerStatusByPort(port: number): Promise<ServerStatus | undefined> {
    return Array.from(this.serverStatuses.values())
      .filter(status => status.port === port)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }
  
  async getAllServerStatuses(): Promise<ServerStatus[]> {
    // Group by port and get the latest for each port
    const latestByPort = new Map<number, ServerStatus>();
    
    for (const status of this.serverStatuses.values()) {
      const existingStatus = latestByPort.get(status.port);
      
      if (!existingStatus || new Date(status.timestamp).getTime() > new Date(existingStatus.timestamp).getTime()) {
        latestByPort.set(status.port, status);
      }
    }
    
    return Array.from(latestByPort.values())
      .sort((a, b) => a.port - b.port);
  }
  
  // System status methods
  async saveSystemStatus(status: InsertSystemStatus): Promise<SystemStatus> {
    const id = this.nextSystemStatusId++;
    const systemStatus: SystemStatus = { 
      ...status, 
      id, 
      lastUpdated: new Date().toISOString() 
    };
    this.systemStatuses.set(id, systemStatus);
    return systemStatus;
  }
  
  async getLatestSystemStatus(): Promise<SystemStatus | undefined> {
    return Array.from(this.systemStatuses.values())
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0];
  }
  
  // Traffic incidents methods
  async createTrafficIncident(incident: InsertTrafficIncident): Promise<TrafficIncident> {
    const id = this.nextTrafficIncidentId++;
    const trafficIncident: TrafficIncident = { 
      ...incident, 
      id, 
      timestamp: new Date().toISOString() 
    };
    this.trafficIncidents.set(id, trafficIncident);
    return trafficIncident;
  }
  
  async getTrafficIncidentsByRegion(region: string): Promise<TrafficIncident[]> {
    return Array.from(this.trafficIncidents.values())
      .filter(incident => incident.region === region)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const storage = new MemStorage();
