import i18next, { type TFunction } from "i18next";
import type { MasjidInfo } from "./types";

// Number mappings for different locales
const NUMBER_MAPPINGS = {
  en: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ur: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"], // Urdu-Arabic numerals
  hi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"], // Devanagari numerals
};

/**
 * Convert English numbers to localized numbers based on locale
 */
export function localizeNumbers(text: string): string {
  const locale = i18next.language;
  if (!text || locale === "en") return text;

  const mapping = NUMBER_MAPPINGS[locale as keyof typeof NUMBER_MAPPINGS];
  if (!mapping) return text;

  return text.replace(/[0-9]/g, (digit) => {
    const num = parseInt(digit, 10);
    return mapping[num] || digit;
  });
}

export function getPrayerName(prayerName: string, t: TFunction): string {
  const prayerKey = prayerName.toLowerCase();
  return t(`prayers.${prayerKey}` as any) || prayerName;
}

export function getLocalizedNA(t: TFunction): string {
  return t("time.na");
}

/**
 * Localize time display (like "2:30")
 */
export function getLocalizedTime(time: string | null): string | null {
  if (!time) return null;
  return localizeNumbers(time);
}

/**
 * Localize period (AM/PM) - keeping AM/PM the same as requested
 */
export function getLocalizedPeriod(period: string | null): string | null {
  return period; // Keep AM/PM as is, but numbers will be localized
}

/**
 * Localize time left text like "8 hrs 24 mins" or "Now"
 */
export function getLocalizedTimeLeft(timeLeft: string, t: TFunction): string {
  if (!timeLeft) return "";

  // Handle special cases
  if (timeLeft.toLowerCase() === "now") return t("time.now");
  if (timeLeft.toLowerCase() === "no data") return getLocalizedNA(t);

  // Localize patterns like "8 hrs 24 mins", "1 hr", "30 mins"
  let localizedText = timeLeft
    .replace(/(\d+)\s*hr(s?)/g, (match, num) => {
      const localizedNum = localizeNumbers(num);
      return `${localizedNum} ${t("time.hours")}`;
    })
    .replace(/(\d+)\s*min(s?)/g, (match, num) => {
      const localizedNum = localizeNumbers(num);
      return `${localizedNum} ${t("time.minutes")}`;
    });

  return localizedText;
}

export function getLocalizedMasjidName(masjidInfo: MasjidInfo | null) {
  if (!masjidInfo) return "";

  const currentLanguage = i18next.language;
  switch (currentLanguage) {
    case "hi":
      return masjidInfo.nameHi || masjidInfo.nameEn;
    case "ur":
      return masjidInfo.nameUr || masjidInfo.nameEn;
    default:
      return masjidInfo.nameEn;
  }
}

export function getLocalizedMasjidAddress(masjidInfo: MasjidInfo | null) {
  if (!masjidInfo) return "";

  const currentLanguage = i18next.language;
  switch (currentLanguage) {
    case "hi":
      return masjidInfo.addressHi || masjidInfo.addressEn;
    case "ur":
      return masjidInfo.addressUr || masjidInfo.addressEn;
    default:
      return masjidInfo.addressEn;
  }
}
