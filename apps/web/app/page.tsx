"use client";

import { PinMasjidCard } from "@web/components/pin-masjid-card";
import usePinMasjidStore from "@web/store/pin-masjid-store";

export default function Home() {
	const pinnedMasjidIds = usePinMasjidStore.use.pinnedMasjidIds();
	return (
		<div className="grid grid-cols-1 gap-3 p-3 pt-[4.063rem] md:grid-cols-2 lg:grid-cols-4">
			{pinnedMasjidIds.map((masjidId) => (
				<PinMasjidCard key={masjidId} masjidId={masjidId} />
			))}
		</div>
	);
}
