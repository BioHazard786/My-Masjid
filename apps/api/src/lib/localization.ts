type Language = "en" | "hi" | "ur";

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
} as const;

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
    en: (count: number) =>
      `${count === 1 ? "prayer time" : "prayer times"} has been updated. Please check the app for the new schedule.`,
    hi: "की नमाज़ का समय बदल गया है। कृपया नए समय के लिए ऐप देखें।",
    ur: "کی نماز کے اوقات تبدیل ہو گئے ہیں۔ براہ کرم نیا شیڈول ملاحظہ فرمائیں۔",
  },
} as const;

/**
 * Get localized prayer names
 */
export function getLocalizedPrayerNames(
  prayerKeys: string[],
  language: Language
): string[] {
  return prayerKeys.map((key) => {
    const prayer = key as keyof typeof prayerTranslations;
    return (
      prayerTranslations[prayer]?.[language] ||
      prayerTranslations[prayer]?.en ||
      key
    );
  });
}

/**
 * Get localized masjid name based on language preference
 */
export function getLocalizedMasjidName(
  masjid: {
    nameEn: string;
    nameHi: string;
    nameUr: string;
  },
  language: Language
): string {
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
export function getLocalizedNotificationText(
  key: keyof typeof notificationTranslations,
  language: Language
): string {
  const value = notificationTranslations[key][language] || notificationTranslations[key].en;
  return typeof value === "function" ? value(1) : value;
}

/**
 * Generate localized notification title and body
 */
export function generateLocalizedNotification(
  masjid: {
    nameEn: string;
    nameHi: string;
    nameUr: string;
  },
  prayerKeys: string[],
  language: Language
): { title: string; body: string } {
  const masjidName = getLocalizedMasjidName(masjid, language);
  const prayerNames = getLocalizedPrayerNames(prayerKeys, language);
  const titleSuffix = getLocalizedNotificationText(
    "prayerTimeUpdated",
    language
  );
  let bodySuffix;
  if (language === "en") {
    const value = notificationTranslations.prayerTimesHaveBeenUpdated.en;
    bodySuffix = value(prayerKeys.length);
  } else {
    bodySuffix = notificationTranslations.prayerTimesHaveBeenUpdated[language];
  }

  return {
    title: `${masjidName}: ${titleSuffix}`,
    body: `${prayerNames.join(", ")} ${bodySuffix}`,
  };
}
