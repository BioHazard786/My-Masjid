import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { betterAuthOptions } from "./src/lib/better-auth-options";

const { CLOUDFLARE_DATABASE_ID, BETTER_AUTH_URL, BETTER_AUTH_SECRET } =
  process.env;

const db = drizzle(CLOUDFLARE_DATABASE_ID! as any); // Not important here, just for schema generation to work

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter(db, { provider: "sqlite" }),
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
});
