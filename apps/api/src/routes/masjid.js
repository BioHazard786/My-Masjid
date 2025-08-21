import * as schema from "@api/db/schema";
import { createAuth, requireAuth } from "@api/lib/auth";
import { generateLocalizedNotification } from "@api/lib/localization";
import { getMasjidTranslations } from "@api/lib/translation-service";
import { zValidator } from "@hono/zod-validator";
import { createMasjidSchema, prayerTimesSchema, } from "@packages/validators/src";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";
/**
 * Check if a string is a valid Expo push token
 */
function isValidExpoPushToken(token) {
    return (typeof token === "string" &&
        (token.startsWith("ExponentPushToken[") ||
            token.startsWith("ExpoPushToken[") ||
            /^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i.test(token)));
}
/**
 * Compress data using gzip compression
 */
async function compressGzip(data) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(data));
            controller.close();
        },
    });
    const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
    const reader = compressedStream.getReader();
    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        chunks.push(value);
    }
    // Combine all chunks into a single Uint8Array
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    return result;
}
async function sendExpoPushNotifications(messages) {
    const jsonData = JSON.stringify(messages);
    // Compress the request body using gzip
    const compressedBody = await compressGzip(jsonData);
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            host: "exp.host",
            accept: "application/json",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/json",
            "content-encoding": "gzip", // Tell the server we're sending gzipped data
        },
        body: compressedBody,
    });
    if (!response.ok) {
        throw new Error(`Expo push API error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
}
/**
 * Send prayer time update notifications asynchronously (fire-and-forget)
 */
async function sendPrayerTimeNotifications(db, masjidId, updatedPrayers, updatedMasjid) {
    try {
        // Get valid push tokens for users who have pinned this masjid
        const pinnedMasjids = await db
            .select({
            pushToken: schema.userPinnedMasjids.pushToken,
            preferredLanguage: schema.userPinnedMasjids.preferredLanguage,
        })
            .from(schema.userPinnedMasjids)
            .where(eq(schema.userPinnedMasjids.masjidId, masjidId));
        const validUsers = pinnedMasjids
            .filter(({ pushToken }) => isValidExpoPushToken(pushToken))
            .map(({ pushToken, preferredLanguage }) => ({
            pushToken,
            preferredLanguage: preferredLanguage,
        }));
        if (validUsers.length === 0)
            return;
        // Create individual messages for each user with their preferred language
        const messages = validUsers.map(({ pushToken, preferredLanguage }) => {
            const { title, body } = generateLocalizedNotification(updatedMasjid, updatedPrayers, preferredLanguage);
            return {
                to: pushToken,
                sound: "default",
                title,
                body,
                data: updatedMasjid,
            };
        });
        // Send notifications
        const tickets = await sendExpoPushNotifications(messages);
        // Collect tokens that failed with DeviceNotRegistered error
        const invalidTokens = tickets
            .filter((ticket) => ticket.status === "error" &&
            ticket.details?.error === "DeviceNotRegistered")
            .map((ticket) => ticket.message?.match(/\"(ExponentPushToken\[.*?\])\"/)?.[1])
            .filter(Boolean);
        // Log other errors
        tickets
            .filter((ticket) => ticket.status === "error" &&
            ticket.details?.error !== "DeviceNotRegistered")
            .forEach((ticket) => {
            console.error(`Failed to send notification: ${ticket.message}`);
        });
        // Delete invalid tokens from the database using deleteMany equivalent
        if (invalidTokens.length > 0) {
            try {
                await db
                    .delete(schema.userPinnedMasjids)
                    .where(inArray(schema.userPinnedMasjids.pushToken, invalidTokens));
                console.log(`Removed ${invalidTokens.length} invalid push tokens from database`);
            }
            catch (deleteError) {
                console.error("Error deleting invalid push tokens:", deleteError);
            }
        }
        console.log(`Sent ${tickets.length} prayer time notifications`);
    }
    catch (error) {
        console.error("Error sending prayer time notifications:", error);
        throw error;
    }
}
const masjidRoutes = new Hono()
    /**
     * Protected Masjid Routes Middleware
     */
    .use("/*", async (c, next) => {
    try {
        const auth = createAuth(c);
        const user = await requireAuth(auth, c.req.raw.headers);
        c.set("user", user);
        await next();
    }
    catch (error) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
    }
})
    /**
     * Get the masjid profile for the authenticated masjid.
     */
    .get("/", async (c) => {
    const db = c.get("db");
    const masjidId = c.get("user").id;
    const [masjid] = await db
        .select()
        .from(schema.masjids)
        .where(eq(schema.masjids.id, masjidId));
    if (!masjid) {
        return c.json({ success: false, message: "Masjid profile not found." }, 404);
    }
    return c.json({ success: true, data: masjid });
})
    /**
     * Create a new masjid profile for the authenticated imam.
     */
    .post("/create", zValidator("json", z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters long"),
})), async (c) => {
    const db = c.get("db");
    const masjidId = c.get("user").id;
    const { name, address } = c.req.valid("json");
    const [existingMasjid] = await db
        .select()
        .from(schema.masjids)
        .where(eq(schema.masjids.id, masjidId));
    if (existingMasjid) {
        return c.json({ success: false, message: "A masjid profile already exists." }, 409);
    }
    const { name: localizedName, address: localizedAddress } = await getMasjidTranslations(name, address, c.env);
    const [newMasjid] = await db
        .insert(schema.masjids)
        .values({
        id: masjidId,
        nameEn: localizedName.english,
        nameHi: localizedName.hindi,
        nameUr: localizedName.urdu,
        addressEn: localizedAddress.english,
        addressHi: localizedAddress.hindi,
        addressUr: localizedAddress.urdu,
    })
        .returning();
    return c.json({ success: true, message: "Masjid profile created.", data: newMasjid }, 201);
})
    /**
     * Update prayer times for the authenticated imam's masjid.
     */
    .put("/prayer-times", zValidator("json", prayerTimesSchema), async (c) => {
    const db = c.get("db");
    const masjidId = c.get("user").id;
    const prayerTimes = c.req.valid("json");
    const [updatedMasjid] = await db
        .update(schema.masjids)
        .set(prayerTimes)
        .where(eq(schema.masjids.id, masjidId))
        .returning();
    if (!updatedMasjid) {
        return c.json({ success: false, message: "Masjid not found for this Imam." }, 404);
    }
    const updatedPrayers = Object.keys(prayerTimes);
    // Don't send notifications if only maghrib prayer is updated
    const shouldSendNotifications = !(updatedPrayers.length === 1 && updatedPrayers[0] === "maghrib");
    if (shouldSendNotifications) {
        // Send push notifications to users who have pinned this masjid (fire-and-forget)
        c.executionCtx.waitUntil(sendPrayerTimeNotifications(db, masjidId, updatedPrayers, updatedMasjid).catch(console.error));
    }
    return c.json({
        success: true,
        message: "Prayer times updated.",
        data: updatedMasjid,
    });
});
export default masjidRoutes;
