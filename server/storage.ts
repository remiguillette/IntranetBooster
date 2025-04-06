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
    
    // Initialize with default users
    this.createUser({
      username: "admin@beavernet.fr",
      password: "password",
      displayName: "Jean Dupont",
      initials: "JD"
    });
    
    // Ajouter l'utilisateur remiguillette comme utilisateur par défaut
    this.createUser({
      username: "remiguillette@gmail.com",
      password: "password", // Vous pourrez changer ce mot de passe si nécessaire
      displayName: "Remi Guillette",
      initials: "RG"
    });
    
    // Initialize with our actual applications
    const defaultApps = [
      {
        name: "Tableau de bord",
        description: "Statistiques et rapports",
        port: 80,
        icon: "layout-dashboard"
      },
      {
        name: "BeaverLaw5002",
        description: "Système de gestion juridique",
        port: 3000,
        icon: "scale"
      },
      {
        name: "BeaverPatch",
        description: "Gestion des mises à jour",
        port: 3003,
        icon: "update"
      },
      {
        name: "BeavernetCRM",
        description: "Gestion des clients",
        port: 3002,
        icon: "users"
      },
      {
        name: "BeaverMonitor",
        description: "Surveillance des systèmes",
        port: 3001,
        icon: "activity"
      },
      {
        name: "BeaverDoc",
        description: "Scanner de documents", 
        port: 5000,
        icon: "scan"
      },
      {
        name: "BeaverScanner",
        description: "Scanner de plaques d'immatriculation",
        port: 4200,
        icon: "car"
      },
      {
        name: "PaymentNoir",
        description: "Système de paiement sécurisé",
        port: 5173,
        icon: "credit-card"
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
