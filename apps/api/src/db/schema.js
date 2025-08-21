import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
export * from "./auth.schema";
/**
 * Masjids Table
 * Stores all information related to a specific masjid, including its
 * prayer times. The 'id' is the primary identifier and will also
 * serve as the Imam's ID for authentication purposes.
 */
export const masjids = sqliteTable("masjids", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()), // Use crypto.randomUUID() for new masjids
    nameEn: text("name_en").notNull(),
    nameHi: text("name_hi").notNull(),
    nameUr: text("name_ur").notNull(),
    addressEn: text("address_en").notNull(),
    addressHi: text("address_hi").notNull(),
    addressUr: text("address_ur").notNull(),
    fajr: text("fajr"),
    dhuhr: text("dhuhr"),
    asr: text("asr"),
    maghrib: text("maghrib"),
    isha: text("isha"),
    jummah: text("jummah"),
});
/**
 * User Pinned Masjids Table
 * This is a join table that connects an anonymous user to the masjids
 * they have "pinned" or saved. It also stores the user's Expo push
 * token, which is essential for sending notifications.
 */
export const userPinnedMasjids = sqliteTable("user_pinned_masjids", {
    deviceId: text("device_id").notNull(), // Anonymous device ID generated on the mobile client
    masjidId: text("masjid_id")
        .notNull()
        .references(() => masjids.id, { onDelete: "cascade" }), // Foreign key to masjids table
    pushToken: text("push_token").notNull(), // Expo push token for notifications
    preferredLanguage: text("preferred_language").notNull(), // User's preferred language for notifications
}, (table) => {
    // Composite primary key to ensure a user can only pin a masjid once
    return [primaryKey({ columns: [table.deviceId, table.masjidId] })];
});
