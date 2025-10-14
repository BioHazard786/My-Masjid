// Utility functions for prayer time formatting and conversion
export function formatTimeFromISOString(
	dateString: string | null | undefined,
): [string | null, string | null] {
	if (!dateString) return [null, null];
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return [null, null];

	let hours = date.getHours();
	const minutes = date.getMinutes();
	const period = hours >= 12 ? "PM" : "AM";

	hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

	const formattedMinutes = minutes.toString().padStart(2, "0");
	return [`${hours}.${formattedMinutes}`, period];
}

export function getRelativeTimeToNow(
	dateString: string | null | undefined,
	currentTime: Date = new Date(),
): string | null {
	if (!dateString) return null;

	const targetDate = new Date(dateString);
	if (Number.isNaN(targetDate.getTime())) return null;

	// Get minutes from midnight for both times
	const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
	const targetMinutes = targetDate.getHours() * 60 + targetDate.getMinutes();

	// Calculate difference in minutes
	const diffMinutes = targetMinutes - currentMinutes;

	let hours: number;
	let minutes: number;
	let isPast = false;

	if (diffMinutes < 0) {
		// Prayer has passed today - show as "ago"
		const absDiff = Math.abs(diffMinutes);
		hours = Math.floor(absDiff / 60);
		minutes = absDiff % 60;
		isPast = true;
	} else if (diffMinutes === 0) {
		// Prayer is happening now
		return "now";
	} else {
		// Prayer is coming up today
		hours = Math.floor(diffMinutes / 60);
		minutes = diffMinutes % 60;
	}

	// Format the output
	const timeStr = (() => {
		if (hours === 0) {
			return `${minutes}m`;
		}
		if (minutes === 0) {
			return `${hours}h`;
		}
		return `${hours}h ${minutes}m`;
	})();

	return isPast ? `${timeStr} ago` : `in ${timeStr}`;
}
