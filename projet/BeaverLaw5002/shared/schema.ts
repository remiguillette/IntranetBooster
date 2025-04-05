import { pgTable, text, serial, integer, boolean, timestamp, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users/Agents schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  badge: text("badge").notNull(),
  isOnline: boolean("is_online").default(false),
  avatar: text("avatar"),
  location: text("location"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isOnline: true,
});

// Animal species enum
export const speciesEnum = pgEnum('species_type', [
  'castor', 'ours', 'loup', 'renard', 'cerf', 'autre'
]);

// Animal status enum
export const statusEnum = pgEnum('status_type', [
  'enregistré', 'en_révision', 'attention_requise', 'perdu', 'trouvé', 'recherché'
]);

// Animals schema
export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull().unique(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  ownerName: text("owner_name"),
  ownerLocation: text("owner_location"),
  status: statusEnum("status").notNull(),
  image: text("image"),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  notes: text("notes"),
});

export const insertAnimalSchema = createInsertSchema(animals).omit({
  id: true,
  registrationDate: true,
  lastUpdated: true,
  identifier: true,
});

// Lost/Found animals schema
export const lostFoundAnimals = pgTable("lost_found_animals", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "lost" or "found"
  species: text("species").notNull(),
  breed: text("breed"),
  description: text("description").notNull(),
  location: text("location").notNull(),
  locationCoordinates: json("location_coordinates").notNull(), // { lat: number, lng: number }
  reportDate: timestamp("report_date").defaultNow().notNull(),
  reporterName: text("reporter_name").notNull(),
  reporterContact: text("reporter_contact").notNull(),
  image: text("image"),
  status: text("status").default("active").notNull(), // "active" or "resolved"
  animalId: integer("animal_id").references(() => animals.id),
});

export const insertLostFoundAnimalSchema = createInsertSchema(lostFoundAnimals).omit({
  id: true,
  reportDate: true,
  status: true,
});

// Wanted notices schema
export const wantedNotices = pgTable("wanted_notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  species: text("species").notNull(),
  lastSeen: text("last_seen").notNull(),
  priority: text("priority").notNull(), // "urgent", "observation", "standard"
  image: text("image"),
  creationDate: timestamp("creation_date").defaultNow().notNull(),
  status: text("status").default("active").notNull(), // "active" or "resolved"
  animalId: integer("animal_id").references(() => animals.id),
});

export const insertWantedNoticeSchema = createInsertSchema(wantedNotices).omit({
  id: true,
  creationDate: true,
  status: true,
});

// Infractions schema
export const infractions = pgTable("infractions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  fine: integer("fine"),
  status: text("status").default("pending").notNull(), // "pending", "processed", "appealed"
  offenderName: text("offender_name"),
  offenderContact: text("offender_contact"),
  agentId: integer("agent_id").references(() => users.id),
});

export const insertInfractionSchema = createInsertSchema(infractions).omit({
  id: true,
  date: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Animal = typeof animals.$inferSelect;
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;

export type LostFoundAnimal = typeof lostFoundAnimals.$inferSelect;
export type InsertLostFoundAnimal = z.infer<typeof insertLostFoundAnimalSchema>;

export type WantedNotice = typeof wantedNotices.$inferSelect;
export type InsertWantedNotice = z.infer<typeof insertWantedNoticeSchema>;

export type Infraction = typeof infractions.$inferSelect;
export type InsertInfraction = z.infer<typeof insertInfractionSchema>;
