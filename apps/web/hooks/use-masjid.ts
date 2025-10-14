import { useQuery } from "@tanstack/react-query";
import { getMasjidById, searchMasjids } from "@web/lib/api";

// Query key constants
export const MASJID_QUERY_KEYS = (masjidId: string) =>
	["persist", "masjid", masjidId] as const;

export const SEARCH_MASJIDS_QUERY_KEY = (query: string) =>
	["search", "masjids", query] as const;

// Hook to get masjid profile (includes prayer times)
export const useMasjidProfile = (masjidId: string) => {
	return useQuery({
		queryKey: MASJID_QUERY_KEYS(masjidId),
		queryFn: async () => await getMasjidById(masjidId),
		select: (data) => data.data,
	});
};

// Hook to get specific prayer times (derived from masjid profile)
export const usePrayerTimes = (masjidId: string) => {
	const {
		data: masjidProfile,
		isLoading,
		error,
		refetch,
	} = useMasjidProfile(masjidId);

	const prayerTimes = masjidProfile
		? [
				{ name: "Fajr", time: masjidProfile.fajr },
				{ name: "Dhuhr", time: masjidProfile.dhuhr },
				{ name: "Asr", time: masjidProfile.asr },
				{ name: "Maghrib", time: masjidProfile.maghrib },
				{ name: "Isha", time: masjidProfile.isha },
				{ name: "Jummah", time: masjidProfile.jummah },
			]
		: [];

	const masjidInfo = masjidProfile
		? {
				id: masjidProfile.id,
				nameEn: masjidProfile.nameEn,
				nameHi: masjidProfile.nameHi,
				nameUr: masjidProfile.nameUr,
				addressEn: masjidProfile.addressEn,
				addressHi: masjidProfile.addressHi,
				addressUr: masjidProfile.addressUr,
			}
		: null;

	return {
		data: prayerTimes,
		masjid: masjidInfo,
		isLoading,
		error,
		refetch,
	};
};

// Hook to search for masjids
export const useSearchMasjids = (query: string) => {
	return useQuery({
		queryKey: SEARCH_MASJIDS_QUERY_KEY(query),
		queryFn: async () => await searchMasjids(query),
		enabled: query.length > 2, // Only search when there's a query
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		select: (data) => data.data,
	});
};
