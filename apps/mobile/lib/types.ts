export type MasjidInfo = {
  id: string;
  nameEn: string;
  nameHi: string;
  nameUr: string;
  addressEn: string;
  addressHi: string;
  addressUr: string;
};

export type PrayerTime = {
  name: string;
  time: string | null | undefined;
};

export type PrayerTimes = PrayerTime[];
