import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express } from "express";
import { storage } from "./storage";
import { insertUserSchema } from "../shared/schema";
import { z } from "zod";
import session from "express-session";
import { randomBytes } from "crypto";
import MemoryStoreFactory from "memorystore";

// In production, use a real session store like connect-mongo or connect-pg-simple
const MemoryStore = MemoryStoreFactory(session);

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy - simple password check (in production, use bcrypt)
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // Simple password comparison (INSECURE - use bcrypt in production)
        if (user.password !== password) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Login route
  app.post("/api/login", async (req, res, next) => {
    try {
      const { username, password } = z.object({ username: z.string(), password: z.string() }).parse(req.body);
      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Register route
  app.post("/api/register", async (req, res) => {
    try {
      const input = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Simple approach - password stored as-is (use bcrypt in production)
      const userData = {
        username: input.username,
        password: input.password,
        fullName: input.fullName || null,
        email: input.email || null,
        phone: null,
        role: "customer"
      };

      const user = await storage.createUser(userData);

      // Auto-login after registration
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
}
