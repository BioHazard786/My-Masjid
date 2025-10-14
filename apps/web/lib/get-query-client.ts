import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
	defaultShouldDehydrateQuery,
	isServer,
	QueryClient,
} from "@tanstack/react-query";

// Create the MMKV storage persister using the new async persister
export const persister = createAsyncStoragePersister({
	storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// Time to cache data (e.g., 24 days)
				gcTime: 1000 * 60 * 60 * 24 * 24,
				// Time to keep data fresh (e.g., 12 hours)
				staleTime: 1000 * 60 * 60 * 12,
			},
			dehydrate: {
				// include pending queries in dehydration
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client
		return makeQueryClient();
	}
	// Browser: make a new query client if we don't already have one
	// This is very important, so we don't re-make a new client if React
	// suspends during the initial render. This may not be needed if we
	// have a suspense boundary BELOW the creation of the query client
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
