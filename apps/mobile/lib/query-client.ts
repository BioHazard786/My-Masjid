import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { MMKV } from "react-native-mmkv";

// --- Online Manager Setup ---
// Makes React Query network-aware
onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

// Initialize MMKV storage
const storage = new MMKV({ id: "tanstack-query-persist" });

// Create the MMKV storage persister using the new async persister
export const persister = createAsyncStoragePersister({
  storage: {
    setItem: (key, value) => storage.set(key, value),
    getItem: (key) => storage.getString(key) ?? null,
    removeItem: (key) => storage.delete(key),
  },
});

// Create the Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time to cache data (e.g., 24 days)
      gcTime: 1000 * 60 * 60 * 24 * 24,
      // Time to keep data fresh (e.g., 12 hours)
      staleTime: 1000 * 60 * 60 * 12,
    },
  },
});
