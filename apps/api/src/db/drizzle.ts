import * as schema from "@api/db/schema";
import type { Bindings, Variables } from "@api/index";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import type { Context, Next } from "hono";

export const createDb = (d1: D1Database): DrizzleD1Database<typeof schema> => {
  return drizzle(d1, { schema });
};
export const drizzleMiddleware =
  () =>
  async (
    c: Context<{ Bindings: Bindings; Variables: Variables }, "*", {}>,
    next: Next
  ) => {
    c.set("db", createDb(c.env.DB));
    await next();
  };
