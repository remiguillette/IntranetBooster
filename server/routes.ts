import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { loginSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import MemoryStoreFactory from "memorystore";

// Extend the Express session with our user ID
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const MemoryStore = MemoryStoreFactory(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "beavernet-secret-key",
    })
  );

  // Check auth middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    next();
  };

  // Register route
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Un utilisateur avec cette adresse e-mail existe déjà" 
        });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      // Save user info in session
      req.session.userId = user.id;
      
      // Return user info (excluding password)
      const { password, ...userInfo } = user;
      return res.status(201).json(userInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de l'inscription" 
      });
    }
  });
  
  // Login route
  app.post("/api/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(credentials.username);
      
      if (!user || user.password !== credentials.password) {
        return res.status(401).json({ 
          message: "Nom d'utilisateur ou mot de passe incorrect" 
        });
      }
      
      // Save user info in session
      req.session.userId = user.id;
      
      // Return user info (excluding password)
      const { password, ...userInfo } = user;
      return res.status(200).json(userInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de la connexion" 
      });
    }
  });
  
  // Logout route
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          message: "Une erreur est survenue lors de la déconnexion" 
        });
      }
      
      res.status(200).json({ message: "Déconnecté avec succès" });
    });
  });
  
  // Get current user
  // Get user data (renamed to match frontend expectations)
  app.get("/api/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId as number);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Return user info (excluding password)
      const { password, ...userInfo } = user;
      return res.status(200).json(userInfo);
    } catch (error) {
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de la récupération de l'utilisateur" 
      });
    }
  });
  
  // Legacy endpoint for compatibility
  app.get("/api/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId as number);
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Return user info (excluding password)
      const { password, ...userInfo } = user;
      return res.status(200).json(userInfo);
    } catch (error) {
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de la récupération de l'utilisateur" 
      });
    }
  });
  
  // Mettre à jour l'image de profil de l'utilisateur
  app.post("/api/user/profile-image", requireAuth, async (req, res) => {
    try {
      const { profileImage } = req.body;
      
      if (!profileImage) {
        return res.status(400).json({ message: "Image de profil manquante" });
      }
      
      const updatedUser = await storage.updateUserProfileImage(
        req.session.userId as number,
        profileImage
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Return user info (excluding password)
      const { password, ...userInfo } = updatedUser;
      return res.status(200).json(userInfo);
    } catch (error) {
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de la mise à jour de l'image de profil" 
      });
    }
  });

  // Get applications
  app.get("/api/applications", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getApplications();
      return res.status(200).json(applications);
    } catch (error) {
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de la récupération des applications" 
      });
    }
  });
  
  // Handle application redirects
  app.get("/app/:id", requireAuth, async (req, res) => {
    try {
      const appId = parseInt(req.params.id);
      if (isNaN(appId)) {
        return res.status(400).json({ message: "ID d'application invalide" });
      }
      
      const application = await storage.getApplication(appId);
      if (!application) {
        return res.status(404).json({ message: "Application non trouvée" });
      }
      
      // Simulate application access
      return res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${application.name} - Beavernet</title>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              background-color: #121212;
              color: #f89422;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            header {
              background-color: #1E1E1E;
              padding: 1rem;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
            h1 {
              color: #f89422;
              margin-bottom: 1rem;
            }
            p {
              color: #e0e0e0;
              margin-bottom: 2rem;
            }
            .btn {
              background-color: #f89422;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.25rem;
              text-decoration: none;
              font-weight: 500;
              transition: background-color 0.2s;
            }
            .btn:hover {
              background-color: #e07c10;
            }
            .icon {
              font-size: 5rem;
              margin-bottom: 2rem;
            }
          </style>
        </head>
        <body>
          <header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h2>Beavernet</h2>
              <a href="/dashboard" class="btn">Retour au tableau de bord</a>
            </div>
          </header>
          <div class="container">
            <div class="icon">🚧</div>
            <h1>${application.name}</h1>
            <p>${application.description}</p>
            <p>Cette application fonctionnerait normalement sur le port ${application.port}.</p>
            <p>Pour des raisons de sécurité et d'architecture, nous simulons l'accès à cette application.</p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de l'accès à l'application" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
