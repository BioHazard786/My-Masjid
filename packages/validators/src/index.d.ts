import { z } from "zod";
export declare const createMasjidSchema: z.ZodObject<{
    nameEn: z.ZodString;
    nameHi: z.ZodString;
    nameUr: z.ZodString;
    addressEn: z.ZodString;
    addressHi: z.ZodString;
    addressUr: z.ZodString;
}, z.core.$strip>;
export declare const prayerTimesSchema: z.ZodObject<{
    fajr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dhuhr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    asr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    maghrib: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isha: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    jummah: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const pinMasjidSchema: z.ZodObject<{
    deviceId: z.ZodString;
    masjidId: z.ZodString;
    pushToken: z.ZodString;
    preferredLanguage: z.ZodString;
}, z.core.$strip>;
export declare const fullMasjidSchema: z.ZodObject<{
    nameEn: z.ZodString;
    nameHi: z.ZodString;
    nameUr: z.ZodString;
    addressEn: z.ZodString;
    addressHi: z.ZodString;
    addressUr: z.ZodString;
    fajr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dhuhr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    asr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    maghrib: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isha: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    jummah: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodString;
}, z.core.$strip>;
