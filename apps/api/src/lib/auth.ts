import type { Bindings, Variables } from "@api/index";
import { betterAuthOptions } from "@api/lib/better-auth-options";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Context } from "hono";

// Better Auth configuration with persistent sessions
export const createAuth = (
  c: Context<{ Bindings: Bindings; Variables: Variables }, "/auth/*", {}>
) =>
  betterAuth({
    ...betterAuthOptions,
    baseURL: c.env.BETTER_AUTH_URL,
    secret: c.env.BETTER_AUTH_SECRET,
    plugins: [expo()],
    database: drizzleAdapter(c.get("db"), {
      provider: "sqlite",
    }),
  });

// Helper function to get current user from session
export const getCurrentUser = async (
  auth: ReturnType<typeof createAuth>,
  headers: Headers
) => {
  try {
    const session = await auth.api.getSession({ headers });
    return session?.user || null;
  } catch (error) {
    return null;
  }
};

// Helper function to require authentication
export const requireAuth = async (
  auth: ReturnType<typeof createAuth>,
  headers: Headers
) => {
  const user = await getCurrentUser(auth, headers);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
};
