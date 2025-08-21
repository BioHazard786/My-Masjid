import * as schema from "@api/db/schema";
import type { Bindings, Variables } from "@api/index";
import { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context, Next } from "hono";
export declare const createDb: (d1: D1Database) => DrizzleD1Database<typeof schema>;
export declare const drizzleMiddleware: () => (c: Context<{
    Bindings: Bindings;
    Variables: Variables;
}, "*", {}>, next: Next) => Promise<void>;
