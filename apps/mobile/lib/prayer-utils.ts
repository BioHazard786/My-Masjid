import type { PrayerTimes } from "@mobile/lib/types";

export const getCurrentPrayer = (
  prayerTimes: PrayerTimes,
  currentTime: Date
) => {
  const currentTimeMinutes =
    currentTime.getHours() * 60 + currentTime.getMinutes();

  let currentPrayer: string | null = null;

  // Since prayerTimes is pre-sorted, iterate and find the last prayer <= currentTime
  for (const { name, time } of prayerTimes) {
    if (!time) continue;

    const prayerMinutes =
      new Date(time).getHours() * 60 + new Date(time).getMinutes();

    if (prayerMinutes <= currentTimeMinutes) currentPrayer = name;
    else break;
  }

  // If no prayer has passed today, use the last prayer from the sorted array
  if (!currentPrayer) {
    const lastPrayer = prayerTimes[prayerTimes.length - 1];
    if (lastPrayer?.time) {
      currentPrayer = lastPrayer.name;
    }
  }

  return currentPrayer;
};

function parseTimeToDate(time: string | null): Date | null {
  return time ? new Date(time) : null;
}

export const formatPrayerTime = (
  prayerTimes: { name: string; time: string | null }[]
): { name: string; time: string | null }[] => {
  const isFriday = new Date().getDay() === 5;
  return prayerTimes
    .filter((prayer) =>
      isFriday ? prayer.name !== "Dhuhr" : prayer.name !== "Jummah"
    )
    .sort((a, b) => {
      const dateA = parseTimeToDate(a.time);
      const dateB = parseTimeToDate(b.time);
      if (!dateA) return 1;
      if (!dateB) return -1;
      const minutesA = dateA.getHours() * 60 + dateA.getMinutes();
      const minutesB = dateB.getHours() * 60 + dateB.getMinutes();
      return minutesA - minutesB;
    });
};

export const getNextPrayerInfo = ({
  prayerTimes,
  currentTime,
}: {
  prayerTimes: PrayerTimes;
  currentTime: Date;
}) => {
  const currentTimeMinutes =
    currentTime.getHours() * 60 + currentTime.getMinutes();

  // Prepare valid prayers with minutes (already sorted from formatPrayerTime)
  const validPrayers = prayerTimes
    .filter((prayer) => !!prayer.time)
    .map((prayer) => {
      const date = new Date(prayer.time!);
      return {
        name: prayer.name,
        minutes: date.getHours() * 60 + date.getMinutes(),
      };
    });

  if (!validPrayers.length) return { name: "No prayers", timeLeft: "No data" };

  // Find next prayer
  const next = validPrayers.find(
    (prayer) => prayer.minutes > currentTimeMinutes
  );

  const getTimeString = (diff: number) => {
    if (diff <= 0) return "Now";
    const h = Math.floor(diff / 60);
    const m = diff % 60;

    const hStr = h > 0 ? `${h} hr${h > 1 ? "s" : ""}` : "";
    const mStr = m > 0 ? `${m} min${m > 1 ? "s" : ""}` : "";

    if (h > 0 && m > 0) {
      return `${hStr} ${mStr}`;
    } else if (h > 0) {
      return hStr;
    } else {
      return mStr;
    }
  };

  if (next) {
    return {
      name: next.name,
      timeLeft: getTimeString(next.minutes - currentTimeMinutes),
    };
  }

  // Next is tomorrow's first prayer
  const firstPrayer = validPrayers[0];
  if (!firstPrayer) {
    return { name: "No prayers", timeLeft: "No data" };
  }

  const totalMinutes = 24 * 60 - currentTimeMinutes + firstPrayer.minutes;
  return {
    name: firstPrayer.name,
    timeLeft: getTimeString(totalMinutes),
  };
};
