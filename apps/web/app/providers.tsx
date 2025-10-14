"use client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { getQueryClient, persister } from "@web/lib/get-query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister,
				maxAge: 1000 * 60 * 60 * 24 * 24, // 24 days
				dehydrateOptions: {
					shouldDehydrateQuery: (query) => query.queryKey[0] === "persist",
				},
			}}
		>
			{children}
		</PersistQueryClientProvider>
	);
}
