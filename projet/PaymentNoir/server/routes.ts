import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { paymentFormSchema, insertUserSchema, type Payment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { setupAuth } from "./auth";

// Admin credentials - in a real app, these would be stored securely
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123"; // Simplifié pour les tests

// Initialize session store - this is now handled in storage.ts to ensure consistency

// Extend express session
declare module 'express-session' {
  interface SessionData {
    isAdmin: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure user authentication (passport)
  setupAuth(app);
  
  // Admin sessions are kept separate from user auth

  // Middleware to check admin authentication
  const checkAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.isAdmin) {
      next();
    } else {
      res.status(401).json({ authenticated: false, message: "Non autorisé" });
    }
  };

  // Admin authentication routes
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      if (req.session) {
        req.session.isAdmin = true;
      }
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ 
        authenticated: false, 
        message: "Nom d'utilisateur ou mot de passe incorrect" 
      });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Erreur lors de la déconnexion" });
        }
        res.status(200).json({ success: true, message: "Déconnecté avec succès" });
      });
    } else {
      res.status(200).json({ success: true, message: "Déjà déconnecté" });
    }
  });

  app.get('/api/admin/check-auth', (req, res) => {
    if (req.session && req.session.isAdmin) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  // Protected admin routes
  app.get('/api/admin/payments', checkAdminAuth, async (req, res) => {
    try {
      // Get all payments
      const payments = await Promise.all(
        (await storage.getAllPayments()).map(async (payment) => {
          const order = await storage.getOrder(payment.orderId);
          return {
            ...payment,
            orderDetails: order ? {
              id: order.id,
              total: order.total,
              status: order.status
            } : null
          };
        })
      );
      
      res.status(200).json({ payments });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des paiements" });
    }
  });
  
  // Create invoice and generate payment link (PayPal-like functionality)
  app.post('/api/admin/invoices/create', checkAdminAuth, async (req, res) => {
    try {
      const { customerName, customerEmail, items, subtotal, tax, total } = req.body;
      
      if (!customerName || !customerEmail || !items || !subtotal || !tax || !total) {
        return res.status(400).json({
          success: false,
          message: "Informations de facture incomplètes"
        });
      }
      
      // Create an order in the database
      const order = await storage.createOrder({
        userId: null, // Anonymous order - can be linked to a user in a more complete implementation
        subtotal,
        tax,
        total,
        status: "pending", // Initial status is pending
      });
      
      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price.toString(),
        });
      }
      
      // Generate a unique token for this payment link (similar to PayPal)
      const token = `invoice-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Construct payment link (using format similar to PayPal links)
      const paymentLink = `${req.protocol}://${req.get('host')}/?invoice=${order.id}&token=${token}`;
      
      // Store customer information (in a real app, you'd store this in the database)
      // For this demo, we're just returning it
      
      res.status(200).json({
        success: true,
        orderId: order.id,
        customerName,
        customerEmail,
        paymentLink,
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la facture"
      });
    }
  });
  
  // Send invoice by email
  app.post('/api/admin/invoices/send-email', checkAdminAuth, async (req, res) => {
    try {
      const { email, paymentLink } = req.body;
      
      if (!email || !paymentLink) {
        return res.status(400).json({
          success: false,
          message: "Email ou lien de paiement manquant"
        });
      }
      
      // In a real implementation, this would send an actual email with the payment link
      // For this demo, we'll simulate a successful email send
      console.log(`[SIMULATION] Sending payment link email to ${email}: ${paymentLink}`);
      
      res.status(200).json({
        success: true,
        message: "Email envoyé avec succès"
      });
    } catch (error) {
      console.error("Error sending invoice email:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'email"
      });
    }
  });

  // Generate payment link
  app.post('/api/admin/orders/:orderId/generate-link', checkAdminAuth, async (req, res) => {
    const orderId = parseInt(req.params.orderId, 10);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de commande invalide" 
      });
    }
    
    try {
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: "Commande non trouvée" 
        });
      }
      
      // Generate a unique token for this payment link (in a real app, this would be stored)
      const token = `token-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Construct payment link (in production, use the actual website domain)
      const paymentLink = `${req.protocol}://${req.get('host')}/?order=${orderId}&token=${token}`;
      
      res.status(200).json({ 
        success: true, 
        paymentLink 
      });
    } catch (error) {
      console.error("Error generating payment link:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur lors de la génération du lien de paiement" 
      });
    }
  });

  // Send payment email (simulated in this implementation)
  app.post('/api/admin/orders/:orderId/send-email', checkAdminAuth, async (req, res) => {
    const orderId = parseInt(req.params.orderId, 10);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ 
        success: false, 
        message: "ID de commande invalide" 
      });
    }
    
    try {
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: "Commande non trouvée" 
        });
      }
      
      // In a real implementation, this would send an actual email
      // For now, we'll simulate a successful email send
      
      console.log(`[SIMULATION] Sending payment email for order ${orderId}`);
      
      res.status(200).json({ 
        success: true, 
        message: "Email envoyé avec succès" 
      });
    } catch (error) {
      console.error("Error sending payment email:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur lors de l'envoi de l'email" 
      });
    }
  });

  // Put application routes here
  // Prefix all routes with /api

  // Generate payment link (non-admin version)
  app.post('/api/payments/generate-link', async (req, res) => {
    try {
      const { orderId, items, total } = req.body;
      
      // In a real implementation, this would create an order in the database
      // For this demo, we'll validate the input and return a sample link
      if (!orderId || !items || !total) {
        return res.status(400).json({
          success: false,
          message: "Informations de commande incomplètes"
        });
      }
      
      // Generate a unique token for this payment link
      const token = `token-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Construct payment link
      const paymentLink = `${req.protocol}://${req.get('host')}/?order=${orderId}&token=${token}`;
      
      res.status(200).json({
        success: true,
        paymentLink
      });
    } catch (error) {
      console.error("Error generating payment link:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la génération du lien de paiement"
      });
    }
  });

  // Payment processing endpoint
  app.post('/api/payments/process', async (req, res) => {
    try {
      // Validate payment form data
      const validatedData = paymentFormSchema.parse(req.body);
      
      // In a real implementation, this would integrate with a payment processor
      // Here we'll simulate a successful payment

      // Create an order
      const order = await storage.createOrder({
        userId: null, // Anonymous order
        subtotal: "89.99",
        tax: "4.50",
        total: "94.49",
        status: "completed",
      });

      // Create order item
      await storage.createOrderItem({
        orderId: order.id,
        productName: "Produit exemple",
        quantity: 1,
        price: "89.99",
      });

      // Create payment record
      const payment = await storage.createPayment({
        orderId: order.id,
        amount: "94.49",
        currency: "CAD",
        paymentMethod: validatedData.paymentMethod,
        status: "completed",
        transactionId: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // Return payment information
      res.status(200).json({
        success: true,
        message: "Paiement traité avec succès",
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
        },
        order: {
          id: order.id,
          total: order.total,
          status: order.status,
        }
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Données de paiement invalides",
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      // Handle other errors
      return res.status(500).json({
        success: false,
        message: "Erreur lors du traitement du paiement"
      });
    }
  });

  // Get payment status endpoint
  app.get('/api/payments/:id', async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      
      if (isNaN(paymentId)) {
        return res.status(400).json({
          success: false,
          message: "ID de paiement invalide"
        });
      }
      
      const payment = await storage.getPayment(paymentId);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Paiement non trouvé"
        });
      }
      
      res.status(200).json({
        success: true,
        payment
      });
    } catch (error) {
      console.error("Error getting payment:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du paiement"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
