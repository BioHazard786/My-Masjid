// Background image mapping for prayer times
const prayerBackgrounds = {
	fajr: [
		"../../packages/assets/backgrounds/fajr-1.jpg",
		"../../packages/assets/backgrounds/fajr-2.jpg",
		"../../packages/assets/backgrounds/fajr-3.jpg",
		"../../packages/assets/backgrounds/fajr-4.jpg",
		"../../packages/assets/backgrounds/fajr-5.jpg",
	],
	dhuhr: [
		"../../packages/assets/backgrounds/dhuhr-1.jpg",
		"../../packages/assets/backgrounds/dhuhr-2.jpg",
		"../../packages/assets/backgrounds/dhuhr-3.jpg",
		"../../packages/assets/backgrounds/dhuhr-4.jpg",
		"../../packages/assets/backgrounds/dhuhr-5.jpg",
	],
	asr: [
		"../../packages/assets/backgrounds/asr-1.jpg",
		"../../packages/assets/backgrounds/asr-2.jpg",
		"../../packages/assets/backgrounds/asr-3.jpg",
		"../../packages/assets/backgrounds/asr-4.jpg",
		"../../packages/assets/backgrounds/asr-5.jpg",
	],
	maghrib: [
		"../../packages/assets/backgrounds/maghrib-1.jpg",
		"../../packages/assets/backgrounds/maghrib-2.jpg",
		"../../packages/assets/backgrounds/maghrib-3.jpg",
		"../../packages/assets/backgrounds/maghrib-4.jpg",
		"../../packages/assets/backgrounds/maghrib-5.jpg",
	],
	isha: [
		"../../packages/assets/backgrounds/isha-1.jpg",
		"../../packages/assets/backgrounds/isha-2.jpg",
		"../../packages/assets/backgrounds/isha-3.jpg",
		"../../packages/assets/backgrounds/isha-4.jpg",
		"../../packages/assets/backgrounds/isha-5.jpg",
	],
} as const;

export type PrayerName = keyof typeof prayerBackgrounds | "jummah";

export function getPrayerBackground(
	currentPrayer: string | null,
	variant?: number,
): string | undefined {
	// Normalize prayer name to lowercase and handle edge cases
	const normalizedPrayer =
		(currentPrayer?.toLowerCase() as PrayerName) || "dhuhr";

	// Map jummah to dhuhr since it's the same time period
	const prayerKey: PrayerName =
		normalizedPrayer === "jummah" ? "dhuhr" : normalizedPrayer;

	// Fallback to dhuhr if prayer not found
	const backgrounds = prayerBackgrounds[prayerKey] || prayerBackgrounds.dhuhr;

	// Use provided variant or random selection
	const selectedVariant =
		variant !== undefined
			? Math.max(0, Math.min(4, variant - 1)) // Clamp to 0-4 range
			: Math.floor(Math.random() * backgrounds.length);

	return backgrounds[selectedVariant];
}

export function getConsistentPrayerBackground(
	currentPrayer: string | null,
	masjidId: string,
) {
	// Get current date string (YYYY-MM-DD format) for daily variation
	const today = new Date().toISOString().split("T")[0];

	// Combine masjidId with today's date for hash generation
	const hashInput = `${masjidId}-${today}`;

	// Create a simple hash from the combined string
	let hash = 0;
	for (let i = 0; i < hashInput.length; i++) {
		const char = hashInput.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}

	// Get variant (1-5) based on hash
	const variant = Math.abs(hash % 5) + 1;

	return getPrayerBackground(currentPrayer, variant);
}
