import { 
  users, 
  applications, 
  type User, 
  type InsertUser, 
  type Application, 
  type InsertApplication 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Application operations
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(app: InsertApplication): Promise<Application>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applications: Map<number, Application>;
  private userIdCounter: number;
  private appIdCounter: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.userIdCounter = 1;
    this.appIdCounter = 1;
    
    // Initialize with a default user
    this.createUser({
      username: "admin@beavernet.fr",
      password: "password",
      displayName: "Jean Dupont",
      initials: "JD"
    });
    
    // Initialize with sample applications
    const defaultApps = [
      {
        name: "Tableau de bord",
        description: "Statistiques et rapports",
        port: 8080,
        icon: "bar-chart-3"
      },
      {
        name: "Calendrier",
        description: "Gestion des événements",
        port: 8081,
        icon: "calendar"
      },
      {
        name: "Messagerie",
        description: "Communications internes",
        port: 8082,
        icon: "mail"
      },
      {
        name: "Ressources Humaines",
        description: "Gestion du personnel",
        port: 8083,
        icon: "users"
      },
      {
        name: "Documents",
        description: "Base documentaire",
        port: 8084,
        icon: "file-text"
      },
      {
        name: "Visioconférence",
        description: "Réunions à distance",
        port: 8085,
        icon: "video"
      },
    ];
    
    defaultApps.forEach(app => this.createApplication(app));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Application methods
  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }
  
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }
  
  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const id = this.appIdCounter++;
    const app: Application = { ...insertApp, id };
    this.applications.set(id, app);
    return app;
  }
}

export const storage = new MemStorage();
