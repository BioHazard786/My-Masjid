import { hash, verify } from "@api/lib/auth-utils";
import type { BetterAuthOptions } from "better-auth";

export const betterAuthOptions: BetterAuthOptions = {
  appName: "My Masjid",
  basePath: "/auth",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash,
      verify,
    },
  },
  trustedOrigins: ["mymasjid://"],
  session: {
    // Very long session expiry (1 year)
    expiresIn: 60 * 60 * 24 * 365, // 365 days
    // Don't update session frequently to avoid unnecessary DB writes
    updateAge: 60 * 60 * 24 * 30, // Update every 30 days
    // Use secure cookies
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 365, // 365 days
    },
  },
};
