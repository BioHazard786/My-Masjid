/**
 * Prayer name translations
 */
const prayerTranslations = {
    fajr: {
        en: "Fajr",
        hi: "फज्र",
        ur: "فجر",
    },
    dhuhr: {
        en: "Dhuhr",
        hi: "ज़ुहर",
        ur: "ظہر",
    },
    asr: {
        en: "Asr",
        hi: "अस्र",
        ur: "عصر",
    },
    maghrib: {
        en: "Maghrib",
        hi: "मग़रिब",
        ur: "مغرب",
    },
    isha: {
        en: "Isha",
        hi: "इशा",
        ur: "عشاء",
    },
    jummah: {
        en: "Jummah",
        hi: "जुमा",
        ur: "جمعہ",
    },
};
/**
 * Notification text translations
 */
const notificationTranslations = {
    prayerTimeUpdated: {
        en: "Prayer Time Update",
        hi: "नमाज़ अपडेट",
        ur: "اوقات میں تبدیلی",
    },
    prayerTimesHaveBeenUpdated: {
        en: "prayer times have been updated. Please check the app for the new schedule.",
        hi: "की नमाज़ का समय बदल गया है। कृपया नए समय के लिए ऐप देखें।",
        ur: "کی نماز کے اوقات تبدیل ہو گئے ہیں۔ براہ کرم نیا شیڈول ملاحظہ فرمائیں۔",
    },
};
/**
 * Get localized prayer names
 */
export function getLocalizedPrayerNames(prayerKeys, language) {
    return prayerKeys.map((key) => {
        const prayer = key;
        return (prayerTranslations[prayer]?.[language] ||
            prayerTranslations[prayer]?.en ||
            key);
    });
}
/**
 * Get localized masjid name based on language preference
 */
export function getLocalizedMasjidName(masjid, language) {
    switch (language) {
        case "hi":
            return masjid.nameHi || masjid.nameEn;
        case "ur":
            return masjid.nameUr || masjid.nameEn;
        case "en":
        default:
            return masjid.nameEn;
    }
}
/**
 * Get localized notification text
 */
export function getLocalizedNotificationText(key, language) {
    return (notificationTranslations[key][language] || notificationTranslations[key].en);
}
/**
 * Generate localized notification title and body
 */
export function generateLocalizedNotification(masjid, prayerKeys, language) {
    const masjidName = getLocalizedMasjidName(masjid, language);
    const prayerNames = getLocalizedPrayerNames(prayerKeys, language);
    const titleSuffix = getLocalizedNotificationText("prayerTimeUpdated", language);
    const bodySuffix = getLocalizedNotificationText("prayerTimesHaveBeenUpdated", language);
    return {
        title: `${masjidName}: ${titleSuffix}`,
        body: `${prayerNames.join(", ")} ${bodySuffix}`,
    };
}
