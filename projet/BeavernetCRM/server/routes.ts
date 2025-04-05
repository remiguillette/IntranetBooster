import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exportToGoogleSheets } from "./services/google-sheets";
import { uploadFile } from "./services/upload-service";
import multer from "multer";
import { z } from "zod";
import { insertClientSchema, insertNoteSchema, insertInteractionSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configuration de multer pour les téléchargements de fichiers
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // limite à 5MB
    },
  });

  // Middleware de gestion des erreurs Zod
  const validateBody = (schema: z.ZodType<any, any>) => {
    return (req: any, res: any, next: any) => {
      try {
        const validated = schema.parse(req.body);
        req.validatedBody = validated;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ message: validationError.message });
        } else {
          next(error);
        }
      }
    };
  };

  // Route pour récupérer tous les clients
  app.get("/api/clients", async (req, res) => {
    try {
      const { search, type, region, sort } = req.query;
      const clients = await storage.getAllClients({
        search: search as string,
        type: type as string,
        region: region as string,
        sort: sort as string,
      });
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des clients" });
    }
  });

  // Route pour récupérer un client spécifique
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID de client invalide" });
      }

      const client = await storage.getClientById(clientId);
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du client" });
    }
  });

  // Route pour créer un nouveau client
  app.post("/api/clients", validateBody(insertClientSchema), async (req, res) => {
    try {
      const newClient = await storage.createClient(req.validatedBody);
      res.status(201).json(newClient);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création du client" });
    }
  });

  // Route pour mettre à jour un client
  app.put("/api/clients/:id", validateBody(insertClientSchema), async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID de client invalide" });
      }

      const updatedClient = await storage.updateClient(clientId, req.validatedBody);
      if (!updatedClient) {
        return res.status(404).json({ message: "Client non trouvé" });
      }

      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du client" });
    }
  });

  // Route pour supprimer un client
  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID de client invalide" });
      }

      const result = await storage.deleteClient(clientId);
      if (!result) {
        return res.status(404).json({ message: "Client non trouvé" });
      }

      res.json({ message: "Client supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du client" });
    }
  });

  // Route pour ajouter une note à un client
  app.post("/api/clients/:id/notes", validateBody(insertNoteSchema), async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID de client invalide" });
      }

      const newNote = await storage.addNoteToClient(clientId, req.validatedBody);
      res.status(201).json(newNote);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de la note" });
    }
  });

  // Route pour ajouter une interaction à un client
  app.post("/api/clients/:id/interactions", validateBody(insertInteractionSchema), async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID de client invalide" });
      }

      const newInteraction = await storage.addInteractionToClient(clientId, req.validatedBody);
      res.status(201).json(newInteraction);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'interaction" });
    }
  });

  // Route pour télécharger des documents
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
      }

      const { documentType, clientId } = req.body;
      
      if (!documentType) {
        return res.status(400).json({ message: "Le type de document est requis" });
      }

      const fileUrl = await uploadFile(req.file, documentType, clientId ? parseInt(clientId) : undefined);
      
      res.json({
        message: "Fichier téléchargé avec succès",
        fileUrl,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors du téléchargement du fichier" });
    }
  });

  // Route pour récupérer tous les documents
  app.get("/api/documents", async (req, res) => {
    try {
      const { search, type } = req.query;
      const documents = await storage.getAllDocuments({
        search: search as string,
        type: type as string,
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des documents" });
    }
  });
  
  // Route pour ajouter un nouveau document
  app.post("/api/documents", async (req, res) => {
    try {
      const { type, client_id, document_url, description, status } = req.body;
      
      if (!type || !client_id || !document_url) {
        return res.status(400).json({ message: "Type de document, client et URL du document sont requis" });
      }
      
      const clientId = parseInt(client_id.toString());
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "ID de client invalide" });
      }
      
      const documentData = {
        client_id: clientId,
        type,
        nom: `Document ${type} - Client ${clientId}`,
        chemin: document_url,
        statut: status || 'a_verifier',
        description: description || '',
        date: new Date().toISOString(),
      };
      
      const newDocument = await storage.addDocumentToClient(clientId, documentData);
      res.status(201).json(newDocument);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      res.status(500).json({ message: "Erreur lors de l'ajout du document" });
    }
  });

  // Route pour exporter des clients vers Google Sheets
  app.get("/api/clients/export", async (req, res) => {
    try {
      const clients = await storage.getAllClients({});
      const sheetUrl = await exportToGoogleSheets(clients);
      
      res.json({
        message: "Données exportées avec succès",
        sheetUrl,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'exportation des données" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
