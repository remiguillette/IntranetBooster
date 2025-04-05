import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnimalSchema, insertInfractionSchema, insertLostFoundAnimalSchema, insertUserSchema, insertWantedNoticeSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to handle validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      if (error instanceof ZodError) {
        return { 
          success: false, 
          error: { 
            message: "Validation error", 
            details: error.errors 
          }
        };
      }
      return { success: false, error: { message: "Unknown error during validation" } };
    }
  };

  // Users/Agents routes
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    const validation = validateRequest(insertUserSchema, req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    try {
      const user = await storage.createUser(validation.data);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(parseInt(req.params.id), req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUser(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Animals routes
  app.get("/api/animals", async (_req, res) => {
    try {
      const animals = await storage.listAnimals();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animals" });
    }
  });

  app.get("/api/animals/:id", async (req, res) => {
    try {
      const animal = await storage.getAnimal(parseInt(req.params.id));
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animal" });
    }
  });

  app.post("/api/animals", async (req, res) => {
    const validation = validateRequest(insertAnimalSchema, req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    try {
      const animal = await storage.createAnimal(validation.data);
      res.status(201).json(animal);
    } catch (error) {
      res.status(500).json({ message: "Failed to create animal" });
    }
  });

  app.put("/api/animals/:id", async (req, res) => {
    try {
      const updatedAnimal = await storage.updateAnimal(parseInt(req.params.id), req.body);
      if (!updatedAnimal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(updatedAnimal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update animal" });
    }
  });

  app.delete("/api/animals/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAnimal(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete animal" });
    }
  });

  // Lost/Found Animals routes
  app.get("/api/lost-found", async (_req, res) => {
    try {
      const lostFound = await storage.listLostFoundAnimals();
      res.json(lostFound);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lost/found animals" });
    }
  });

  app.get("/api/lost-found/:id", async (req, res) => {
    try {
      const lostFound = await storage.getLostFoundAnimal(parseInt(req.params.id));
      if (!lostFound) {
        return res.status(404).json({ message: "Lost/found animal record not found" });
      }
      res.json(lostFound);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lost/found animal record" });
    }
  });

  app.post("/api/lost-found", async (req, res) => {
    const validation = validateRequest(insertLostFoundAnimalSchema, req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    try {
      const lostFound = await storage.createLostFoundAnimal(validation.data);
      res.status(201).json(lostFound);
    } catch (error) {
      res.status(500).json({ message: "Failed to create lost/found animal record" });
    }
  });

  app.put("/api/lost-found/:id", async (req, res) => {
    try {
      const updated = await storage.updateLostFoundAnimal(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Lost/found animal record not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lost/found animal record" });
    }
  });

  app.delete("/api/lost-found/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLostFoundAnimal(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Lost/found animal record not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete lost/found animal record" });
    }
  });

  // Wanted Notices routes
  app.get("/api/wanted-notices", async (_req, res) => {
    try {
      const notices = await storage.listWantedNotices();
      res.json(notices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wanted notices" });
    }
  });

  app.get("/api/wanted-notices/:id", async (req, res) => {
    try {
      const notice = await storage.getWantedNotice(parseInt(req.params.id));
      if (!notice) {
        return res.status(404).json({ message: "Wanted notice not found" });
      }
      res.json(notice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wanted notice" });
    }
  });

  app.post("/api/wanted-notices", async (req, res) => {
    const validation = validateRequest(insertWantedNoticeSchema, req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    try {
      const notice = await storage.createWantedNotice(validation.data);
      res.status(201).json(notice);
    } catch (error) {
      res.status(500).json({ message: "Failed to create wanted notice" });
    }
  });

  app.put("/api/wanted-notices/:id", async (req, res) => {
    try {
      const updated = await storage.updateWantedNotice(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Wanted notice not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update wanted notice" });
    }
  });

  app.delete("/api/wanted-notices/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWantedNotice(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Wanted notice not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete wanted notice" });
    }
  });

  // Infractions routes
  app.get("/api/infractions", async (_req, res) => {
    try {
      const infractions = await storage.listInfractions();
      res.json(infractions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch infractions" });
    }
  });

  app.get("/api/infractions/:id", async (req, res) => {
    try {
      const infraction = await storage.getInfraction(parseInt(req.params.id));
      if (!infraction) {
        return res.status(404).json({ message: "Infraction not found" });
      }
      res.json(infraction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch infraction" });
    }
  });

  app.post("/api/infractions", async (req, res) => {
    const validation = validateRequest(insertInfractionSchema, req.body);
    if (!validation.success) {
      return res.status(400).json(validation.error);
    }

    try {
      const infraction = await storage.createInfraction(validation.data);
      res.status(201).json(infraction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create infraction" });
    }
  });

  app.put("/api/infractions/:id", async (req, res) => {
    try {
      const updated = await storage.updateInfraction(parseInt(req.params.id), req.body);
      if (!updated) {
        return res.status(404).json({ message: "Infraction not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update infraction" });
    }
  });

  app.delete("/api/infractions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteInfraction(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Infraction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete infraction" });
    }
  });

  // Statistics for dashboard
  app.get("/api/statistics", async (_req, res) => {
    try {
      const animals = await storage.listAnimals();
      const lostFound = await storage.listLostFoundAnimals();
      const wanted = await storage.listWantedNotices();
      const infractionsData = await storage.listInfractions();

      // Calculate monthly change percentages (mock data for now)
      const statistics = {
        animals: {
          count: animals.length,
          change: animals.length > 0 ? 12 : 0
        },
        lostFound: {
          count: lostFound.length,
          change: lostFound.length > 0 ? -8 : 0
        },
        wanted: {
          count: wanted.length,
          change: wanted.length > 0 ? 5 : 0
        },
        infractions: {
          count: infractionsData.length,
          change: infractionsData.length > 0 ? 18 : 0
        }
      };

      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
