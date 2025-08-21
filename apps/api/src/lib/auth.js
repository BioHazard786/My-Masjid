import { betterAuthOptions } from "@api/lib/better-auth-options";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// Better Auth configuration with persistent sessions
export const createAuth = (c) => betterAuth({
    ...betterAuthOptions,
    baseURL: c.env.BETTER_AUTH_URL,
    secret: c.env.BETTER_AUTH_SECRET,
    plugins: [expo()],
    database: drizzleAdapter(c.get("db"), {
        provider: "sqlite",
    }),
});
// Helper function to get current user from session
export const getCurrentUser = async (auth, headers) => {
    try {
        const session = await auth.api.getSession({ headers });
        return session?.user || null;
    }
    catch (error) {
        return null;
    }
};
// Helper function to require authentication
export const requireAuth = async (auth, headers) => {
    const user = await getCurrentUser(auth, headers);
    if (!user) {
        throw new Error("Authentication required");
    }
    return user;
};
