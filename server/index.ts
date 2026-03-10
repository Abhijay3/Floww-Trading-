import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

/* ---------------- TYPES ---------------- */

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

/* ---------------- BODY PARSER ---------------- */

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

/* ---------------- SESSION ---------------- */

app.use(
  session({
    secret: process.env.SESSION_SECRET || "floow-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

/* ---------------- LOGGER ---------------- */

export function log(message: string, source = "express") {

  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);

}

/* ---------------- REQUEST LOGGER ---------------- */

app.use((req, res, next) => {

  const start = Date.now();
  const path = req.path;

  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;

  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {

    const duration = Date.now() - start;

    if (path.startsWith("/api")) {

      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);

    }

  });

  next();

});

/* ---------------- SERVER START ---------------- */

(async () => {

  await registerRoutes(httpServer, app);

  /* -------- ERROR HANDLER -------- */

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {

    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });

  });

  /* -------- FRONTEND -------- */

  if (process.env.NODE_ENV === "production") {

    serveStatic(app);

  } else {

    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);

  }

  /* -------- PORT -------- */

  const port = parseInt(process.env.PORT || "5001", 10);

  httpServer.listen(port, "0.0.0.0", () => {

    log(`serving on port ${port}`);

  });

})();