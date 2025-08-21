import { z } from "zod";
// Schema for creating a new masjid profile
export const createMasjidSchema = z.object({
    nameEn: z.string().min(3, "Name must be at least 3 characters long"),
    nameHi: z.string().min(3, "Name must be at least 3 characters long"),
    nameUr: z.string().min(3, "Name must be at least 3 characters long"),
    addressEn: z.string().min(5, "Address must be at least 5 characters long"),
    addressHi: z.string().min(5, "Address must be at least 5 characters long"),
    addressUr: z.string().min(5, "Address must be at least 5 characters long"),
});
// Schema for updating prayer times
export const prayerTimesSchema = z.object({
    fajr: z.string().optional().nullable(),
    dhuhr: z.string().optional().nullable(),
    asr: z.string().optional().nullable(),
    maghrib: z.string().optional().nullable(),
    isha: z.string().optional().nullable(),
    jummah: z.string().optional().nullable(),
});
// You can also add schemas for user routes here if needed
export const pinMasjidSchema = z.object({
    deviceId: z.string().min(1),
    masjidId: z.string().min(1),
    pushToken: z.string().min(1),
    preferredLanguage: z
        .string()
        .min(2, "Preferred language must be at least 2 characters long"),
});
export const fullMasjidSchema = createMasjidSchema
    .extend(prayerTimesSchema.shape)
    .extend({
    id: z.string().min(1), // Changed from z.uuid() to z.string().min(1)
});
