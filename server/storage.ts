import type { 
  User, 
  InsertUser, 
  Application, 
  InsertApplication 
} from "@shared/schema";


// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfileImage(userId: number, profileImage: string): Promise<User | undefined>;

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
      password: "MC44rg99qc@", // Vous pourrez changer ce mot de passe si nécessaire
      displayName: "Remi Guillette",
      initials: "RG"
    });

    // Initialize with our actual applications
    const defaultApps = [
      {
        name: "BeaverPatch",
        description: "CAD system",
        port: 5001,
        icon: "LayoutDashboard"
      },
      {
        name: "BeaverLaw",
        description: "Contrôles Animalier",
        port: 5002,
        icon: "Cat"
      },
      {
        name: "BeaverScanner",
        description: "lecture automatisée de plaques d'immatriculation",
        port: 5003,
        icon: "ScanLine"
      },
      {
        name: "BeavernetCRM",
        description: "Gestion des clients",
        port: 5004,
        icon: "Users"
      },
      {
        name: "BeaverDoc",
        description: "Surveillance des document",
        port: 5005,
        icon: "FileSignature"
      },
      {
        name: "BeaverPay",
        description: "Système de paiement sécurisé", 
        port: 5006,
        icon: "CreditCard"
      },
      {
        name: "BeaverMonitor",
        description: "Information",
        port: 5007,
        icon: "MonitorDot"
      },
      {
        name: "BeaverDMV",
        description: "Vérification du permis de conduire",
        port: 5008,
        icon: "IdCard"
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
    const user: User = { ...insertUser, id, profileImage: null };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfileImage(userId: number, profileImage: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, profileImage };
    this.users.set(userId, updatedUser);
    return updatedUser;
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