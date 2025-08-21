type Language = "en" | "hi" | "ur";
/**
 * Notification text translations
 */
declare const notificationTranslations: {
    readonly prayerTimeUpdated: {
        readonly en: "Prayer Time Update";
        readonly hi: "नमाज़ अपडेट";
        readonly ur: "اوقات میں تبدیلی";
    };
    readonly prayerTimesHaveBeenUpdated: {
        readonly en: "prayer times have been updated. Please check the app for the new schedule.";
        readonly hi: "की नमाज़ का समय बदल गया है। कृपया नए समय के लिए ऐप देखें।";
        readonly ur: "کی نماز کے اوقات تبدیل ہو گئے ہیں۔ براہ کرم نیا شیڈول ملاحظہ فرمائیں۔";
    };
};
/**
 * Get localized prayer names
 */
export declare function getLocalizedPrayerNames(prayerKeys: string[], language: Language): string[];
/**
 * Get localized masjid name based on language preference
 */
export declare function getLocalizedMasjidName(masjid: {
    nameEn: string;
    nameHi: string;
    nameUr: string;
}, language: Language): string;
/**
 * Get localized notification text
 */
export declare function getLocalizedNotificationText(key: keyof typeof notificationTranslations, language: Language): string;
/**
 * Generate localized notification title and body
 */
export declare function generateLocalizedNotification(masjid: {
    nameEn: string;
    nameHi: string;
    nameUr: string;
}, prayerKeys: string[], language: Language): {
    title: string;
    body: string;
};
export {};
