import { 
  users, type User, type InsertUser,
  animals, type Animal, type InsertAnimal,
  lostFoundAnimals, type LostFoundAnimal, type InsertLostFoundAnimal,
  wantedNotices, type WantedNotice, type InsertWantedNotice,
  infractions, type Infraction, type InsertInfraction
} from "@shared/schema";
import { customAlphabet } from 'nanoid';

// Generate a simple identifier for animals
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export interface IStorage {
  // User/Agent operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Animal operations
  getAnimal(id: number): Promise<Animal | undefined>;
  getAnimalByIdentifier(identifier: string): Promise<Animal | undefined>;
  createAnimal(animal: InsertAnimal): Promise<Animal>;
  listAnimals(limit?: number): Promise<Animal[]>;
  updateAnimal(id: number, animalData: Partial<InsertAnimal>): Promise<Animal | undefined>;
  deleteAnimal(id: number): Promise<boolean>;

  // Lost/Found Animals operations
  getLostFoundAnimal(id: number): Promise<LostFoundAnimal | undefined>;
  createLostFoundAnimal(animal: InsertLostFoundAnimal): Promise<LostFoundAnimal>;
  listLostFoundAnimals(limit?: number): Promise<LostFoundAnimal[]>;
  updateLostFoundAnimal(id: number, data: Partial<InsertLostFoundAnimal>): Promise<LostFoundAnimal | undefined>;
  deleteLostFoundAnimal(id: number): Promise<boolean>;

  // Wanted Notices operations
  getWantedNotice(id: number): Promise<WantedNotice | undefined>;
  createWantedNotice(notice: InsertWantedNotice): Promise<WantedNotice>;
  listWantedNotices(limit?: number): Promise<WantedNotice[]>;
  updateWantedNotice(id: number, data: Partial<InsertWantedNotice>): Promise<WantedNotice | undefined>;
  deleteWantedNotice(id: number): Promise<boolean>;
  
  // Infractions operations
  getInfraction(id: number): Promise<Infraction | undefined>;
  createInfraction(infraction: InsertInfraction): Promise<Infraction>;
  listInfractions(limit?: number): Promise<Infraction[]>;
  updateInfraction(id: number, data: Partial<InsertInfraction>): Promise<Infraction | undefined>;
  deleteInfraction(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private animals: Map<number, Animal>;
  private lostFoundAnimals: Map<number, LostFoundAnimal>;
  private wantedNotices: Map<number, WantedNotice>;
  private infractions: Map<number, Infraction>;
  private nextId: {
    users: number;
    animals: number;
    lostFoundAnimals: number;
    wantedNotices: number;
    infractions: number;
  };

  constructor() {
    this.users = new Map();
    this.animals = new Map();
    this.lostFoundAnimals = new Map();
    this.wantedNotices = new Map();
    this.infractions = new Map();
    
    this.nextId = {
      users: 1,
      animals: 1,
      lostFoundAnimals: 1,
      wantedNotices: 1,
      infractions: 1,
    };
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add a default admin user
    this.createUser({
      username: "admin",
      password: "adminpass",
      name: "Agent Dubois",
      role: "Administrateur",
      badge: "A-001",
      avatar: "",
      location: "Québec"
    });
  }

  // User/Agent operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextId.users++;
    const user: User = { ...insertUser, id, isOnline: false };
    this.users.set(id, user);
    return user;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser: User = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Animal operations
  async getAnimal(id: number): Promise<Animal | undefined> {
    return this.animals.get(id);
  }

  async getAnimalByIdentifier(identifier: string): Promise<Animal | undefined> {
    return Array.from(this.animals.values()).find(
      (animal) => animal.identifier === identifier
    );
  }

  async createAnimal(insertAnimal: InsertAnimal): Promise<Animal> {
    const id = this.nextId.animals++;
    const identifier = `AN-${new Date().getFullYear()}-${nanoid(3)}`;
    const now = new Date();
    
    const animal: Animal = {
      ...insertAnimal,
      id,
      identifier,
      registrationDate: now,
      lastUpdated: now
    };
    
    this.animals.set(id, animal);
    return animal;
  }

  async listAnimals(limit?: number): Promise<Animal[]> {
    const animals = Array.from(this.animals.values());
    return limit ? animals.slice(0, limit) : animals;
  }

  async updateAnimal(id: number, animalData: Partial<InsertAnimal>): Promise<Animal | undefined> {
    const existingAnimal = this.animals.get(id);
    if (!existingAnimal) return undefined;

    const updatedAnimal: Animal = {
      ...existingAnimal,
      ...animalData,
      lastUpdated: new Date()
    };
    
    this.animals.set(id, updatedAnimal);
    return updatedAnimal;
  }

  async deleteAnimal(id: number): Promise<boolean> {
    return this.animals.delete(id);
  }

  // Lost/Found Animals operations
  async getLostFoundAnimal(id: number): Promise<LostFoundAnimal | undefined> {
    return this.lostFoundAnimals.get(id);
  }

  async createLostFoundAnimal(insertLostFoundAnimal: InsertLostFoundAnimal): Promise<LostFoundAnimal> {
    const id = this.nextId.lostFoundAnimals++;
    const animal: LostFoundAnimal = {
      ...insertLostFoundAnimal,
      id,
      reportDate: new Date(),
      status: "active"
    };
    
    this.lostFoundAnimals.set(id, animal);
    return animal;
  }

  async listLostFoundAnimals(limit?: number): Promise<LostFoundAnimal[]> {
    const animals = Array.from(this.lostFoundAnimals.values());
    return limit ? animals.slice(0, limit) : animals;
  }

  async updateLostFoundAnimal(id: number, data: Partial<InsertLostFoundAnimal>): Promise<LostFoundAnimal | undefined> {
    const existingRecord = this.lostFoundAnimals.get(id);
    if (!existingRecord) return undefined;

    const updatedRecord: LostFoundAnimal = { ...existingRecord, ...data };
    this.lostFoundAnimals.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteLostFoundAnimal(id: number): Promise<boolean> {
    return this.lostFoundAnimals.delete(id);
  }

  // Wanted Notices operations
  async getWantedNotice(id: number): Promise<WantedNotice | undefined> {
    return this.wantedNotices.get(id);
  }

  async createWantedNotice(insertWantedNotice: InsertWantedNotice): Promise<WantedNotice> {
    const id = this.nextId.wantedNotices++;
    const notice: WantedNotice = {
      ...insertWantedNotice,
      id,
      creationDate: new Date(),
      status: "active"
    };
    
    this.wantedNotices.set(id, notice);
    return notice;
  }

  async listWantedNotices(limit?: number): Promise<WantedNotice[]> {
    const notices = Array.from(this.wantedNotices.values());
    return limit ? notices.slice(0, limit) : notices;
  }

  async updateWantedNotice(id: number, data: Partial<InsertWantedNotice>): Promise<WantedNotice | undefined> {
    const existingNotice = this.wantedNotices.get(id);
    if (!existingNotice) return undefined;

    const updatedNotice: WantedNotice = { ...existingNotice, ...data };
    this.wantedNotices.set(id, updatedNotice);
    return updatedNotice;
  }

  async deleteWantedNotice(id: number): Promise<boolean> {
    return this.wantedNotices.delete(id);
  }
  
  // Infractions operations
  async getInfraction(id: number): Promise<Infraction | undefined> {
    return this.infractions.get(id);
  }

  async createInfraction(insertInfraction: InsertInfraction): Promise<Infraction> {
    const id = this.nextId.infractions++;
    const infraction: Infraction = {
      ...insertInfraction,
      id,
      date: new Date()
    };
    
    this.infractions.set(id, infraction);
    return infraction;
  }

  async listInfractions(limit?: number): Promise<Infraction[]> {
    const infractions = Array.from(this.infractions.values());
    return limit ? infractions.slice(0, limit) : infractions;
  }

  async updateInfraction(id: number, data: Partial<InsertInfraction>): Promise<Infraction | undefined> {
    const existingInfraction = this.infractions.get(id);
    if (!existingInfraction) return undefined;

    const updatedInfraction: Infraction = { ...existingInfraction, ...data };
    this.infractions.set(id, updatedInfraction);
    return updatedInfraction;
  }

  async deleteInfraction(id: number): Promise<boolean> {
    return this.infractions.delete(id);
  }
}

export const storage = new MemStorage();
