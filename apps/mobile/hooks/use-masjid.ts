import useI18n from "@mobile/hooks/use-i18n";
import {
  changePreferredLanguage,
  createMasjid,
  getMasjidById,
  pinMasjid,
  searchMasjids,
  unpinMasjid,
  updatePrayerTimes,
} from "@mobile/lib/api";
import useExpoPushTokenStore from "@mobile/store/expo-push-token-store";
import usePinMasjidStore from "@mobile/store/pin-masjid-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";

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
    staleTime: 1000 * 60 * 60, // 1 hour - prayer times don't change frequently
    select: (data) => data.data,
  });
};

// Hook to create a masjid
export const useCreateMasjid = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: createMasjid,
    onSuccess: (data, variables) => {
      // Set the query data for the newly created masjid
      if (data.success && data.data?.id) {
        queryClient.setQueryData(MASJID_QUERY_KEYS(data.data.id), data);
      }

      ToastAndroid.show(
        t("search.createSuccess", { name: variables.name }),
        ToastAndroid.SHORT
      );
    },
    onError: (error: any) => {
      console.error("Failed to create masjid:", error);
      ToastAndroid.show(
        error?.message || t("search.createError"),
        ToastAndroid.SHORT
      );
    },
  });
};

// Hook to update prayer times - now only called on form submission
export const useUpdatePrayerTimes = (masjidId: string) => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: updatePrayerTimes,
    onSuccess: (data) => {
      queryClient.setQueryData(MASJID_QUERY_KEYS(masjidId), data);

      ToastAndroid.show(t("admin.updateSuccess"), ToastAndroid.SHORT);
    },
    onError: (error: any) => {
      console.error("Failed to update prayer times:", error);
      ToastAndroid.show(
        error?.message || t("admin.updateError"),
        ToastAndroid.SHORT
      );
    },
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

// Hook to pin a masjid
export const usePinMasjid = () => {
  const { pinMasjid: storePinMasjid, unpinMasjid: storeUnpinMasjid } =
    usePinMasjidStore();
  const expoPushToken = useExpoPushTokenStore.use.expoPushToken();
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (masjidId: string) => {
      if (!expoPushToken) {
        throw new Error(t("search.pushTokenError"));
      }

      // Pin in local store first for immediate UI feedback
      storePinMasjid(masjidId);

      // Send to server with push token and device ID
      return pinMasjid(masjidId, expoPushToken);
    },
    onError: (error: any, masjidId: string) => {
      // Revert local store change on error
      storeUnpinMasjid(masjidId);
      console.error("Failed to pin masjid:", error);
      ToastAndroid.show(
        error?.message || t("search.pinError"),
        ToastAndroid.SHORT
      );
    },
  });
};

// Hook to unpin a masjid
export const useUnpinMasjid = () => {
  const { unpinMasjid: storeUnpinMasjid, pinMasjid: storePinMasjid } =
    usePinMasjidStore();
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (masjidId: string) => {
      // Unpin in local store first for immediate UI feedback
      storeUnpinMasjid(masjidId);

      // Call API to unpin masjid
      return unpinMasjid(masjidId);
    },
    onError: (error: any, masjidId: string) => {
      // Revert local store change on error
      storePinMasjid(masjidId);
      console.error("Failed to unpin masjid:", error);
      ToastAndroid.show(
        error?.message || t("search.unpinError"),
        ToastAndroid.SHORT
      );
    },
  });
};

// Hook to change preferred language
export const useChangePreferredLanguage = () => {
  return useMutation({
    mutationFn: changePreferredLanguage,
  });
};
