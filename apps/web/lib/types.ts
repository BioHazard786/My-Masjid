export type Masjid = {
    nameEn: string;
    nameHi: string;
    nameUr: string;
    addressEn: string;
    addressHi: string;
    addressUr: string;
    id: string;
    fajr?: string | null | undefined;
    dhuhr?: string | null | undefined;
    asr?: string | null | undefined;
    maghrib?: string | null | undefined;
    isha?: string | null | undefined;
    jummah?: string | null | undefined;
}