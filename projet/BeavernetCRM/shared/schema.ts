import { pgTable, text, serial, integer, boolean, date, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Types de documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull(),
  type: text("type").notNull(), // permis, carte_grise, identite, domicile, autre
  nom: text("nom").notNull(),
  chemin: text("chemin").notNull(),
  date_telechargement: timestamp("date_telechargement").defaultNow().notNull(),
  statut: text("statut").notNull().default("valide"), // valide, expire, a_verifier
  metadonnees: json("metadonnees"),
});

// Permis de conduire
export const permis = pgTable("permis", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull().unique(),
  numero: text("numero").notNull(),
  date_emission: text("date_emission").notNull(),
  date_expiration: text("date_expiration").notNull(),
  type: text("type").notNull(), // A, B, C, etc.
  document_url: text("document_url"),
});

// Véhicules
export const vehicules = pgTable("vehicules", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull(),
  immatriculation: text("immatriculation").notNull(),
  marque: text("marque").notNull(),
  modele: text("modele").notNull(),
  annee: text("annee").notNull(),
  document_url: text("document_url"),
});

// Interactions avec les clients
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull(),
  type: text("type").notNull(), // appel, email, en_personne, etc.
  date: timestamp("date").defaultNow().notNull(),
  agent: text("agent"),
  description: text("description").notNull(),
});

// Notes sur les clients
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull(),
  titre: text("titre"),
  contenu: text("contenu").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  auteur: text("auteur"),
});

// Table principale des clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  nom_complet: text("nom_complet").notNull(),
  email: text("email").notNull().unique(),
  date_naissance: text("date_naissance").notNull(),
  telephone: text("telephone").notNull(),
  adresse: text("adresse").notNull(),
  type: text("type").default("particulier"), // particulier, entreprise
  region: text("region"),
  date_inscription: timestamp("date_inscription").defaultNow().notNull(),
  derniere_visite: timestamp("derniere_visite").defaultNow(),
  documents_complets: boolean("documents_complets").default(false),
  renouvellement_proche: boolean("renouvellement_proche").default(false),
});

// Schémas Zod pour la validation
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  date_telechargement: true,
});

export const insertPermisSchema = createInsertSchema(permis).omit({
  id: true,
});

export const insertVehiculeSchema = createInsertSchema(vehicules).omit({
  id: true,
});

export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true,
  date: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  date: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  date_inscription: true,
  derniere_visite: true,
});

// Types pour l'application
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Permis = typeof permis.$inferSelect;
export type InsertPermis = z.infer<typeof insertPermisSchema>;

export type Vehicule = typeof vehicules.$inferSelect;
export type InsertVehicule = z.infer<typeof insertVehiculeSchema>;

export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type Client = typeof clients.$inferSelect & {
  permis?: Permis;
  vehicule?: Vehicule;
  interactions?: Interaction[];
  notes?: Note[];
  documents?: Record<string, any>;
};
export type InsertClient = z.infer<typeof insertClientSchema>;
