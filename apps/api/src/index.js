import * as schema from "@api/db/schema";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
// Auth
import { createAuth } from "@api/lib/auth";
// Import routes
import masjidRoutes from "@api/routes/masjid";
import userRoutes from "@api/routes/user";
// Import Durable Object class
import { drizzleMiddleware } from "@api/db/drizzle";
// Initialize Hono app with types
const app = new Hono();
// --- Middleware ---
app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", drizzleMiddleware());
app.use("*", cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
}));
// --- API Routes ---
app.all("/auth/*", async (c) => {
    const auth = createAuth(c);
    const response = await auth.handler(c.req.raw);
    return response;
});
// Register the routes from the separate files
const apiRoutes = app.route("/user", userRoutes).route("/masjid", masjidRoutes);
export default {
    fetch: app.fetch,
};
