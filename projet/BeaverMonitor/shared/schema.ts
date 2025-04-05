import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Weather schema
export const weatherAlerts = pgTable("weather_alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'danger', 'warning', 'success'
  message: text("message").notNull(),
  region: text("region").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  active: boolean("active").notNull().default(true),
});

export const insertWeatherAlertSchema = createInsertSchema(weatherAlerts).omit({
  id: true,
  timestamp: true,
});

export type InsertWeatherAlert = z.infer<typeof insertWeatherAlertSchema>;
export type WeatherAlert = typeof weatherAlerts.$inferSelect;

// Server status schema
export const serverStatus = pgTable("server_status", {
  id: serial("id").primaryKey(),
  port: integer("port").notNull(),
  status: text("status").notNull(), // 'online', 'offline', 'warning', 'restarting'
  cpu: integer("cpu").notNull(),
  ram: integer("ram").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertServerStatusSchema = createInsertSchema(serverStatus).omit({
  id: true,
  timestamp: true,
});

export type InsertServerStatus = z.infer<typeof insertServerStatusSchema>;
export type ServerStatus = typeof serverStatus.$inferSelect;

// Traffic incident schema
export const trafficIncidents = pgTable("traffic_incidents", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(), // 'GTA Toronto', 'Toronto', 'Hamilton', 'Niagara Region'
  location: text("location").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'accident', 'construction', 'congestion', 'info'
  severity: text("severity").notNull(), // 'danger', 'warning', 'success'
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTrafficIncidentSchema = createInsertSchema(trafficIncidents).omit({
  id: true,
  timestamp: true,
});

export type InsertTrafficIncident = z.infer<typeof insertTrafficIncidentSchema>;
export type TrafficIncident = typeof trafficIncidents.$inferSelect;

// Weather data schema
export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  temperature: integer("temperature").notNull(),
  humidity: integer("humidity").notNull(),
  wind: integer("wind").notNull(),
  precipitation: integer("precipitation").notNull(),
  icon: text("icon").notNull(),
  forecast: jsonb("forecast").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type WeatherData = typeof weatherData.$inferSelect;

// System status schema
export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  cpuAverage: integer("cpu_average").notNull(),
  ramAverage: integer("ram_average").notNull(),
  ramTotal: integer("ram_total").notNull(),
  uptime: integer("uptime").notNull(), // in seconds
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  lastUpdated: true,
});

export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
