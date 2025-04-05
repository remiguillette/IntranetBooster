import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchWeatherData } from "./services/weatherService";
import { fetchTrafficData } from "./services/trafficService";
import { monitorServer, getSystemStatus } from "./services/serverMonitorService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API endpoints
  app.get('/api/weather/alerts', async (req, res) => {
    try {
      const alerts = await storage.getActiveWeatherAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des alertes météo' });
    }
  });

  app.get('/api/weather/:city', async (req, res) => {
    try {
      const city = req.params.city;
      const weatherData = await fetchWeatherData(city);
      res.json(weatherData);
    } catch (error) {
      console.error(`Error fetching weather for ${req.params.city}:`, error);
      res.status(500).json({ message: `Erreur lors de la récupération des données météo pour ${req.params.city}` });
    }
  });

  // Traffic API endpoints
  app.get('/api/traffic/:region', async (req, res) => {
    try {
      const region = req.params.region;
      const trafficData = await fetchTrafficData(region);
      res.json(trafficData);
    } catch (error) {
      console.error(`Error fetching traffic for ${req.params.region}:`, error);
      res.status(500).json({ message: `Erreur lors de la récupération des données de circulation pour ${req.params.region}` });
    }
  });

  // Server status API endpoints
  app.get('/api/servers/status', async (req, res) => {
    try {
      const serverStatus = await monitorServer();
      res.json(serverStatus);
    } catch (error) {
      console.error('Error fetching server status:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du statut des serveurs' });
    }
  });

  app.get('/api/system/status', async (req, res) => {
    try {
      const systemStatus = await getSystemStatus();
      res.json(systemStatus);
    } catch (error) {
      console.error('Error fetching system status:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du statut du système' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
