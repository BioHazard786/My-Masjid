import * as schema from "@api/db/schema";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
export const createDb = (d1) => {
    return drizzle(d1, { schema });
};
export const drizzleMiddleware = () => async (c, next) => {
    c.set("db", createDb(c.env.DB));
    await next();
};
