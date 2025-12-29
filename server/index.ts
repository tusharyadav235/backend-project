import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { storage } from "./storage";

const app = express();
const httpServer = createServer(app);

/* ---------------- BASIC CONFIG ---------------- */
app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

/* ---------------- LOGGER ---------------- */
export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("en-IN");
  console.log(`${time} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} ${Date.now() - start}ms`);
    }
  });

  next();
});

/* ---------------- ADMIN INIT (PRODUCTION SAFE) ---------------- */
const ensureAdmin = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.warn("⚠️ Admin credentials not set in ENV");
      return;
    }

    const admin = await storage.getUserByUsername(adminUsername);

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await storage.createUser({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
        fullName: "Administrator",
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        phone: process.env.ADMIN_PHONE || "",
      });

      log("✅ Admin user created from ENV");
    }
  } catch (err) {
    log("Admin creation failed", "error");
  }
};

/* ---------------- APP START ---------------- */
(async () => {
  await registerRoutes(httpServer, app);
  await ensureAdmin();

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  /* -------- GLOBAL ERROR HANDLER (LAST) -------- */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    log(err.message || "Unhandled error", "error");
    res.status(status).json({ message: "Internal Server Error" });
  });

  const port = Number(process.env.PORT || 5000);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running on port ${port}`);
  });
})();
