import * as schema from "@api/db/schema";
import { zValidator } from "@hono/zod-validator";
import { pinMasjidSchema } from "@packages/validators/src";
import { and, eq, like, or } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
const userRoutes = new Hono()
    /**
     * Endpoint to get a single masjid's details by its ID.
     */
    .get("/masjid/:id", async (c) => {
    const db = c.get("db");
    const { id } = c.req.param();
    try {
        const [masjid] = await db
            .select()
            .from(schema.masjids)
            .where(eq(schema.masjids.id, id));
        if (!masjid) {
            return c.json({ success: false, error: { message: "Masjid not found." } }, 404);
        }
        return c.json({ success: true, data: masjid });
    }
    catch (error) {
        console.error("Failed to fetch masjid by ID:", error);
        return c.json({ success: false, error: { message: "An error occurred." } }, 500);
    }
})
    /**
     * Endpoint to search for masjids.
     */
    .get("/masjids/search", zValidator("query", z.object({ q: z.string().min(1, "Search query is required.") })), async (c) => {
    const db = c.get("db");
    const { q } = c.req.valid("query");
    const results = await db
        .select()
        .from(schema.masjids)
        .where(or(like(schema.masjids.nameEn, `%${q}%`), like(schema.masjids.nameHi, `%${q}%`), like(schema.masjids.nameUr, `%${q}%`)))
        .limit(20);
    return c.json({ success: true, data: results });
})
    /**
     * Endpoint for a user to pin a masjid.
     */
    .post("/masjids/pin", zValidator("json", pinMasjidSchema), async (c) => {
    const db = c.get("db");
    const { deviceId, masjidId, pushToken, preferredLanguage } = c.req.valid("json");
    try {
        await db
            .insert(schema.userPinnedMasjids)
            .values({ deviceId, masjidId, pushToken, preferredLanguage })
            .onConflictDoNothing();
        return c.json({
            success: true,
            data: { message: "Masjid pinned successfully." },
        });
    }
    catch (error) {
        console.error("Failed to pin masjid:", error);
        return c.json({ success: false, error: { message: "An error occurred." } }, 500);
    }
})
    /**
     * Endpoint for a user to unpin a masjid.
     */
    .post("/masjids/unpin", zValidator("json", pinMasjidSchema.omit({ pushToken: true, preferredLanguage: true })), async (c) => {
    const db = c.get("db");
    const { deviceId, masjidId } = c.req.valid("json");
    try {
        await db
            .delete(schema.userPinnedMasjids)
            .where(and(eq(schema.userPinnedMasjids.deviceId, deviceId), eq(schema.userPinnedMasjids.masjidId, masjidId)));
        return c.json({
            success: true,
            data: { message: "Masjid unpinned successfully." },
        });
    }
    catch (error) {
        console.error("Failed to unpin masjid:", error);
        return c.json({ success: false, error: { message: "An error occurred." } }, 500);
    }
})
    /**
     * Endpoint for a user to get their pinned masjids.
     */
    .get("/masjids/pinned", zValidator("json", pinMasjidSchema.omit({
    pushToken: true,
    preferredLanguage: true,
    masjidId: true,
})), async (c) => {
    const db = c.get("db");
    const { deviceId } = c.req.valid("json");
    try {
        const pinnedMasjids = await db
            .select()
            .from(schema.userPinnedMasjids)
            .where(eq(schema.userPinnedMasjids.deviceId, deviceId));
        return c.json({ success: true, data: pinnedMasjids });
    }
    catch (error) {
        console.error("Failed to fetch pinned masjids:", error);
        return c.json({ success: false, error: { message: "An error occurred." } }, 500);
    }
})
    /**
     * Endpoint for a user to update their preferred language.
     */
    .post("/changePreferredLanguage", zValidator("json", pinMasjidSchema.omit({ masjidId: true, pushToken: true })), async (c) => {
    const db = c.get("db");
    const { deviceId, preferredLanguage } = c.req.valid("json");
    try {
        await db
            .update(schema.userPinnedMasjids)
            .set({ preferredLanguage })
            .where(eq(schema.userPinnedMasjids.deviceId, deviceId));
        return c.json({
            success: true,
            data: { message: "Preferred language updated successfully." },
        });
    }
    catch (error) {
        console.error("Failed to update preferred language:", error);
        return c.json({ success: false, error: { message: "An error occurred." } }, 500);
    }
});
export default userRoutes;
