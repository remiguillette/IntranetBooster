import { 
  clients, 
  permis, 
  vehicules,
  interactions,
  notes,
  documents,
  type Client,
  type InsertClient,
  type Permis,
  type InsertPermis,
  type Vehicule,
  type InsertVehicule,
  type Interaction,
  type InsertInteraction,
  type Note,
  type InsertNote,
  type Document,
  type InsertDocument
} from "@shared/schema";

export interface IStorage {
  // Gestion des clients
  getClientById(id: number): Promise<Client | undefined>;
  getAllClients(options: {
    search?: string;
    type?: string;
    region?: string;
    sort?: string;
  }): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: InsertClient): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Gestion des permis
  getPermisById(id: number): Promise<Permis | undefined>;
  getPermisByClientId(clientId: number): Promise<Permis | undefined>;
  createPermis(permis: InsertPermis): Promise<Permis>;
  updatePermis(id: number, permis: InsertPermis): Promise<Permis | undefined>;
  
  // Gestion des véhicules
  getVehiculeById(id: number): Promise<Vehicule | undefined>;
  getVehiculesByClientId(clientId: number): Promise<Vehicule[]>;
  createVehicule(vehicule: InsertVehicule): Promise<Vehicule>;
  updateVehicule(id: number, vehicule: InsertVehicule): Promise<Vehicule | undefined>;
  
  // Gestion des interactions
  getInteractionsByClientId(clientId: number): Promise<Interaction[]>;
  addInteractionToClient(clientId: number, interaction: InsertInteraction): Promise<Interaction>;
  
  // Gestion des notes
  getNotesByClientId(clientId: number): Promise<Note[]>;
  addNoteToClient(clientId: number, note: InsertNote): Promise<Note>;
  
  // Gestion des documents
  getAllDocuments(options: {
    search?: string;
    type?: string;
  }): Promise<Document[]>;
  getDocumentsByClientId(clientId: number): Promise<Document[]>;
  addDocumentToClient(clientId: number, document: InsertDocument): Promise<Document>;
  updateDocumentStatus(id: number, status: string): Promise<Document | undefined>;
}

export class MemStorage implements IStorage {
  private clientsData: Map<number, Client>;
  private permisData: Map<number, Permis>;
  private vehiculesData: Map<number, Vehicule>;
  private interactionsData: Map<number, Interaction>;
  private notesData: Map<number, Note>;
  private documentsData: Map<number, Document>;
  
  private clientIdCounter: number;
  private permisIdCounter: number;
  private vehiculeIdCounter: number;
  private interactionIdCounter: number;
  private noteIdCounter: number;
  private documentIdCounter: number;

  constructor() {
    this.clientsData = new Map();
    this.permisData = new Map();
    this.vehiculesData = new Map();
    this.interactionsData = new Map();
    this.notesData = new Map();
    this.documentsData = new Map();
    
    this.clientIdCounter = 1;
    this.permisIdCounter = 1;
    this.vehiculeIdCounter = 1;
    this.interactionIdCounter = 1;
    this.noteIdCounter = 1;
    this.documentIdCounter = 1;
    
    // Ajout de quelques données de démonstration
    this.initDemoData();
  }

  private initDemoData() {
    // Ajout de trois clients de démonstration
    const martin = this.createClient({
      nom_complet: "Martin Dubois",
      email: "martin.dubois@email.com",
      date_naissance: "15/04/1985",
      telephone: "06 12 34 56 78",
      adresse: "123 Rue de la République, 75001 Paris",
      type: "particulier",
      region: "Île-de-France"
    });
    
    const sophie = this.createClient({
      nom_complet: "Sophie Leroy",
      email: "sophie.leroy@email.com",
      date_naissance: "23/09/1990",
      telephone: "07 98 76 54 32",
      adresse: "45 Avenue Victor Hugo, 69003 Lyon",
      type: "particulier",
      region: "Rhône-Alpes"
    });
    
    const pierre = this.createClient({
      nom_complet: "Pierre Girard",
      email: "pierre.girard@email.com",
      date_naissance: "07/12/1978",
      telephone: "06 54 32 10 98",
      adresse: "8 Rue du Commerce, 33000 Bordeaux",
      type: "particulier",
      region: "Nouvelle-Aquitaine"
    });
    
    // Ajout des permis
    this.createPermis({
      client_id: martin.id,
      numero: "123456789ABC",
      date_emission: "10/05/2010",
      date_expiration: "10/05/2025",
      type: "B",
      document_url: "/uploads/permis-123456.jpg"
    });
    
    this.createPermis({
      client_id: sophie.id,
      numero: "987654321CBA",
      date_emission: "15/03/2012",
      date_expiration: "15/03/2027",
      type: "B, A",
      document_url: "/uploads/permis-987654.jpg"
    });
    
    this.createPermis({
      client_id: pierre.id,
      numero: "456789123DEF",
      date_emission: "20/08/2008",
      date_expiration: "20/08/2023",
      type: "B, C",
      document_url: "/uploads/permis-456789.jpg"
    });
    
    // Ajout des véhicules
    this.createVehicule({
      client_id: martin.id,
      immatriculation: "AB-123-CD",
      marque: "Renault",
      modele: "Clio",
      annee: "2019",
      document_url: "/uploads/carte-grise-123.jpg"
    });
    
    this.createVehicule({
      client_id: sophie.id,
      immatriculation: "EF-456-GH",
      marque: "Peugeot",
      modele: "3008",
      annee: "2021",
      document_url: "/uploads/carte-grise-456.jpg"
    });
    
    this.createVehicule({
      client_id: pierre.id,
      immatriculation: "IJ-789-KL",
      marque: "Citroën",
      modele: "C4",
      annee: "2020",
      document_url: "/uploads/carte-grise-789.jpg"
    });
    
    // Ajout des interactions
    this.addInteractionToClient(martin.id, {
      client_id: martin.id,
      type: "appel",
      agent: "Jean Dupont",
      description: "Discussion concernant le renouvellement prochain du permis."
    });
    
    this.addInteractionToClient(martin.id, {
      client_id: martin.id,
      type: "email",
      agent: "Jean Dupont",
      description: "Envoi des documents pour la mise à jour du dossier."
    });
    
    this.addInteractionToClient(sophie.id, {
      client_id: sophie.id,
      type: "appel",
      agent: "Marie Lambert",
      description: "Confirmation de réception des documents."
    });
    
    // Ajout des notes
    this.addNoteToClient(martin.id, {
      client_id: martin.id,
      titre: "Rappel important",
      contenu: "Rappeler au client que son permis expire dans 3 mois. Il faudra prévoir le renouvellement.",
      auteur: "Jean Dupont"
    });
    
    this.addNoteToClient(martin.id, {
      client_id: martin.id,
      titre: "Préférences",
      contenu: "Client préfère être contacté par téléphone plutôt que par email. Disponible en soirée après 18h.",
      auteur: "Marie Lambert"
    });
    
    // Mise à jour des flags
    const martinClient = this.clientsData.get(martin.id);
    if (martinClient) {
      martinClient.renouvellement_proche = true;
      martinClient.documents_complets = true;
      this.clientsData.set(martin.id, martinClient);
    }
    
    const sophieClient = this.clientsData.get(sophie.id);
    if (sophieClient) {
      sophieClient.documents_complets = true;
      this.clientsData.set(sophie.id, sophieClient);
    }
  }

  // Implémentation des méthodes pour les clients
  async getClientById(id: number): Promise<Client | undefined> {
    const client = this.clientsData.get(id);
    if (!client) return undefined;
    
    return this.enrichClientData(client);
  }

  async getAllClients(options: {
    search?: string;
    type?: string;
    region?: string;
    sort?: string;
  }): Promise<Client[]> {
    let result = Array.from(this.clientsData.values());
    
    // Filtrage par recherche
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      result = result.filter(client => 
        client.nom_complet.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.telephone.includes(options.search!) ||
        client.adresse.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrage par type
    if (options.type) {
      result = result.filter(client => client.type === options.type);
    }
    
    // Filtrage par région
    if (options.region) {
      result = result.filter(client => client.region === options.region);
    }
    
    // Tri
    if (options.sort) {
      switch(options.sort) {
        case 'nom_asc':
          result.sort((a, b) => a.nom_complet.localeCompare(b.nom_complet));
          break;
        case 'nom_desc':
          result.sort((a, b) => b.nom_complet.localeCompare(a.nom_complet));
          break;
        case 'date_asc':
          result.sort((a, b) => new Date(a.date_inscription).getTime() - new Date(b.date_inscription).getTime());
          break;
        case 'date_desc':
          result.sort((a, b) => new Date(b.date_inscription).getTime() - new Date(a.date_inscription).getTime());
          break;
      }
    }
    
    // Enrichir les données des clients avec les relations
    return Promise.all(result.map(client => this.enrichClientData(client)));
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const now = new Date().toISOString();
    
    const client: Client = {
      ...clientData,
      id,
      date_inscription: now,
      derniere_visite: now,
      documents_complets: false,
      renouvellement_proche: false
    };
    
    this.clientsData.set(id, client);
    return client;
  }

  async updateClient(id: number, clientData: InsertClient): Promise<Client | undefined> {
    const existingClient = this.clientsData.get(id);
    if (!existingClient) return undefined;
    
    const updatedClient: Client = {
      ...existingClient,
      ...clientData,
      id: existingClient.id,
      date_inscription: existingClient.date_inscription,
      derniere_visite: new Date().toISOString()
    };
    
    this.clientsData.set(id, updatedClient);
    return this.enrichClientData(updatedClient);
  }

  async deleteClient(id: number): Promise<boolean> {
    if (!this.clientsData.has(id)) return false;
    
    // Supprimer le client
    this.clientsData.delete(id);
    
    // Supprimer les données associées
    // Permis
    const permisToDelete = Array.from(this.permisData.values())
      .filter(p => p.client_id === id)
      .map(p => p.id);
    
    permisToDelete.forEach(pid => this.permisData.delete(pid));
    
    // Véhicules
    const vehiculesToDelete = Array.from(this.vehiculesData.values())
      .filter(v => v.client_id === id)
      .map(v => v.id);
    
    vehiculesToDelete.forEach(vid => this.vehiculesData.delete(vid));
    
    // Interactions
    const interactionsToDelete = Array.from(this.interactionsData.values())
      .filter(i => i.client_id === id)
      .map(i => i.id);
    
    interactionsToDelete.forEach(iid => this.interactionsData.delete(iid));
    
    // Notes
    const notesToDelete = Array.from(this.notesData.values())
      .filter(n => n.client_id === id)
      .map(n => n.id);
    
    notesToDelete.forEach(nid => this.notesData.delete(nid));
    
    // Documents
    const documentsToDelete = Array.from(this.documentsData.values())
      .filter(d => d.client_id === id)
      .map(d => d.id);
    
    documentsToDelete.forEach(did => this.documentsData.delete(did));
    
    return true;
  }

  // Implémentation des méthodes pour les permis
  async getPermisById(id: number): Promise<Permis | undefined> {
    return this.permisData.get(id);
  }

  async getPermisByClientId(clientId: number): Promise<Permis | undefined> {
    return Array.from(this.permisData.values()).find(p => p.client_id === clientId);
  }

  async createPermis(permisData: InsertPermis): Promise<Permis> {
    const id = this.permisIdCounter++;
    
    const permis: Permis = {
      ...permisData,
      id
    };
    
    this.permisData.set(id, permis);
    return permis;
  }

  async updatePermis(id: number, permisData: InsertPermis): Promise<Permis | undefined> {
    const existingPermis = this.permisData.get(id);
    if (!existingPermis) return undefined;
    
    const updatedPermis: Permis = {
      ...existingPermis,
      ...permisData,
      id: existingPermis.id
    };
    
    this.permisData.set(id, updatedPermis);
    return updatedPermis;
  }

  // Implémentation des méthodes pour les véhicules
  async getVehiculeById(id: number): Promise<Vehicule | undefined> {
    return this.vehiculesData.get(id);
  }

  async getVehiculesByClientId(clientId: number): Promise<Vehicule[]> {
    return Array.from(this.vehiculesData.values()).filter(v => v.client_id === clientId);
  }

  async createVehicule(vehiculeData: InsertVehicule): Promise<Vehicule> {
    const id = this.vehiculeIdCounter++;
    
    const vehicule: Vehicule = {
      ...vehiculeData,
      id
    };
    
    this.vehiculesData.set(id, vehicule);
    return vehicule;
  }

  async updateVehicule(id: number, vehiculeData: InsertVehicule): Promise<Vehicule | undefined> {
    const existingVehicule = this.vehiculesData.get(id);
    if (!existingVehicule) return undefined;
    
    const updatedVehicule: Vehicule = {
      ...existingVehicule,
      ...vehiculeData,
      id: existingVehicule.id
    };
    
    this.vehiculesData.set(id, updatedVehicule);
    return updatedVehicule;
  }

  // Implémentation des méthodes pour les interactions
  async getInteractionsByClientId(clientId: number): Promise<Interaction[]> {
    return Array.from(this.interactionsData.values())
      .filter(i => i.client_id === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addInteractionToClient(clientId: number, interactionData: InsertInteraction): Promise<Interaction> {
    const id = this.interactionIdCounter++;
    const now = new Date().toISOString();
    
    const interaction: Interaction = {
      ...interactionData,
      id,
      date: now
    };
    
    this.interactionsData.set(id, interaction);
    
    // Mettre à jour la dernière visite du client
    const client = this.clientsData.get(clientId);
    if (client) {
      client.derniere_visite = now;
      this.clientsData.set(clientId, client);
    }
    
    return interaction;
  }

  // Implémentation des méthodes pour les notes
  async getNotesByClientId(clientId: number): Promise<Note[]> {
    return Array.from(this.notesData.values())
      .filter(n => n.client_id === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addNoteToClient(clientId: number, noteData: InsertNote): Promise<Note> {
    const id = this.noteIdCounter++;
    const now = new Date().toISOString();
    
    const note: Note = {
      ...noteData,
      id,
      date: now
    };
    
    this.notesData.set(id, note);
    return note;
  }

  // Implémentation des méthodes pour les documents
  async getAllDocuments(options: {
    search?: string;
    type?: string;
  }): Promise<Document[]> {
    let result = Array.from(this.documentsData.values());
    
    // Filtrage par recherche
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      result = result.filter(doc => 
        doc.nom.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrage par type
    if (options.type) {
      result = result.filter(doc => doc.type === options.type);
    }
    
    return result.sort((a, b) => new Date(b.date_telechargement).getTime() - new Date(a.date_telechargement).getTime());
  }

  async getDocumentsByClientId(clientId: number): Promise<Document[]> {
    return Array.from(this.documentsData.values())
      .filter(d => d.client_id === clientId)
      .sort((a, b) => new Date(b.date_telechargement).getTime() - new Date(a.date_telechargement).getTime());
  }

  async addDocumentToClient(clientId: number, documentData: InsertDocument): Promise<Document> {
    const id = this.documentIdCounter++;
    const now = new Date().toISOString();
    
    const document: Document = {
      ...documentData,
      id,
      date_telechargement: now
    };
    
    this.documentsData.set(id, document);
    return document;
  }

  async updateDocumentStatus(id: number, status: string): Promise<Document | undefined> {
    const existingDocument = this.documentsData.get(id);
    if (!existingDocument) return undefined;
    
    existingDocument.statut = status;
    this.documentsData.set(id, existingDocument);
    
    return existingDocument;
  }

  // Méthode utilitaire pour enrichir les données d'un client avec ses relations
  private async enrichClientData(client: Client): Promise<Client> {
    const permis = await this.getPermisByClientId(client.id);
    const vehicules = await this.getVehiculesByClientId(client.id);
    const interactions = await this.getInteractionsByClientId(client.id);
    const notes = await this.getNotesByClientId(client.id);
    const documents = await this.getDocumentsByClientId(client.id);
    
    // Créer un objet de documents par type
    const documentsMap: Record<string, any> = {};
    documents.forEach(doc => {
      documentsMap[doc.type] = {
        id: doc.id,
        url: doc.chemin,
        date: doc.date_telechargement,
        status: doc.statut
      };
    });
    
    // Récupérer le premier véhicule pour simplifier l'interface
    const vehicule = vehicules.length > 0 ? vehicules[0] : undefined;
    
    return {
      ...client,
      permis,
      vehicule,
      interactions,
      notes,
      documents: documentsMap
    };
  }
}

export const storage = new MemStorage();
