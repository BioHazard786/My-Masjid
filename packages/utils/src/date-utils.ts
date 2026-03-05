
/**
 * specific dates for ramadan and eid
 */
export const RAMADAN_MONTH_INDEX = 8; // 0-indexed, so 8 is 9th month (Ramadan)
export const SHAWWAL_MONTH_INDEX = 9; // 10th month
export const DHUL_HIJJAH_MONTH_INDEX = 11; // 12th month

/**
 * Returns the current Hijri date information using Intl.DateTimeFormat
 */
export function getHijriDate(date: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  
  const parts = formatter.formatToParts(date);
  const day = parseInt(parts.find((p) => p.type === "day")?.value || "0", 10);
  const month = parseInt(parts.find((p) => p.type === "month")?.value || "0", 10) - 1; // 0-indexed
  const year = parseInt(parts.find((p) => p.type === "year")?.value || "0", 10);

  return { day, month, year };
}

/**
 * Checks if Ramadan times (Sehar/Iftar) should be displayed.
 * Show if:
 * - Current month is Ramadan (index 8)
 * - Current month is Shaban (index 7) and day is >= 29 (1-2 days before)
 */
export function shouldShowRamadanTimes(date: Date = new Date()): boolean {
  const { month, day } = getHijriDate(date);
  const SHABAN_MONTH_INDEX = 7;

  if (month === RAMADAN_MONTH_INDEX) return true;
  if (month === SHABAN_MONTH_INDEX && day >= 28) return true; // Approx 1-2 days before
  
  return false;
}

/**
 * Checks if Eid ul Fitr times should be displayed.
 * Show if:
 * - Current month is Ramadan (index 8) and day >= 25 (approx 5-6 days before)
 * - Current month is Shawwal (index 9) and day <= 3 (First few days of Eid)
 */
export function shouldShowEidUlFitrTimes(date: Date = new Date()): boolean {
  const { month, day } = getHijriDate(date);

  if (month === RAMADAN_MONTH_INDEX && day >= 24) return true;
  if (month === SHAWWAL_MONTH_INDEX && day <= 3) return true;

  return false;
}

/**
 * Checks if Eid ul Azha times should be displayed.
 * Show if:
 * - Current month is Dhul Hijjah (index 11) and day is between 4 and 13
 * (Eid is on 10th, show 5-6 days before, lasts for 3 days)
 */
export function shouldShowEidUlAzhaTimes(date: Date = new Date()): boolean {
  const { month, day } = getHijriDate(date);

  if (month === DHUL_HIJJAH_MONTH_INDEX && day >= 4 && day <= 13) return true;

  return false;
}
