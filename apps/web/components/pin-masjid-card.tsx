/** biome-ignore-all lint/style/noNonNullAssertion: bs */
import {
	cn,
	formatPrayerTime,
	formatTimeFromISOString,
	getCurrentPrayer,
	getRelativeTimeToNow,
} from "@packages/utils";
import { usePrayerTimes } from "@web/hooks/use-masjid";
import { getConsistentPrayerBackground } from "@web/lib/bg-utils";
import usePinMasjidStore from "@web/store/pin-masjid-store";
import { useEffect, useState } from "react";

interface PinMasjidCardProps {
	masjidId: string;
	className?: string;
}

const PrayerTimeItem = ({
	name,
	dateString,
	isActive,
	currentTime,
}: {
	name: string;
	dateString: string | null;
	isActive?: boolean;
	currentTime: Date;
}) => {
	const [showRelativeTime, setShowRelativeTime] = useState(false);
	const [time, period] = formatTimeFromISOString(dateString);
	const relativeTime = getRelativeTimeToNow(dateString, currentTime);

	const handleToggleTimeFormat = () => {
		setShowRelativeTime(!showRelativeTime);
	};

	return (
		<div className="flex justify-between items-center rounded-full px-6 py-4">
			<div className="flex-1 flex items-center gap-2">
				<span
					className={cn(
						"text-lg",
						isActive ? "text-primary" : "text-secondary",
					)}
				>
					{name}
				</span>
			</div>
			<button
				type="button"
				onClick={handleToggleTimeFormat}
				className="cursor-pointer"
				aria-label="Toggle time format"
			>
				<div className="flex items-baseline">
					{time ? (
						showRelativeTime && relativeTime ? (
							<span
								className={cn(
									"text-lg font-bold ",
									isActive ? "text-primary" : "text-secondary",
								)}
							>
								{relativeTime}
							</span>
						) : (
							<>
								<span
									className={cn(
										"text-lg font-bold",
										isActive ? "text-primary" : "text-secondary",
									)}
								>
									{time}
								</span>
								<span
									className={cn(
										"text-xs font-bold ml-1",
										isActive ? "text-primary" : "text-secondary",
									)}
								>
									{period}
								</span>
							</>
						)
					) : (
						<span className="text-lg font-bold text-secondary">N/A</span>
					)}
				</div>
			</button>
		</div>
	);
};

export function PinMasjidCard({ masjidId, className }: PinMasjidCardProps) {
	const unpinMasjid = usePinMasjidStore.use.unpinMasjid();

	const {
		data: prayerData,
		masjid: masjidInfo,
		isLoading,
		error,
	} = usePrayerTimes(masjidId);

	const [currentTime, setCurrentTime] = useState(new Date());

	// Update current time every minute for real-time prayer tracking
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000); // Update every minute

		return () => clearInterval(interval);
	}, []);

	const prayerTimes = formatPrayerTime(prayerData);

	const currentPrayer = getCurrentPrayer(prayerTimes, currentTime);

	// Get dynamic background based on current prayer and masjid ID
	const backgroundImage = getConsistentPrayerBackground(
		currentPrayer,
		masjidId,
	);

	if (isLoading) {
		return (
			<div className="border border-border rounded-2xl mx-6">
				<div className="w-full h-48 rounded-t-2xl bg-card" />
				<div className="flex-1 w-full h-64 flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
				</div>
			</div>
		);
	}

	if (error || !masjidInfo) {
		return <div className="text-destructive">Error loading masjid data</div>;
	}

	const handleUnpinMasjid = () => {
		if (
			window.confirm(`Are you sure you want to unpin ${masjidInfo.nameEn}?`)
		) {
			try {
				unpinMasjid(masjidInfo.id);
				// You can add toast notification here if you have a toast system
				console.log(`${masjidInfo.nameEn} unpinned!`);
			} catch (error) {
				console.error("Error unpinning masjid:", error);
			}
		}
	};

	return (
		<div className={cn("bg-card rounded-2xl space-y-2", className)}>
			<div
				className="w-full h-48 lg:h-64 rounded-t-2xl bg-center bg-cover"
				style={{ backgroundImage: `url(${backgroundImage})` }}
			/>
			<div className="rounded-b-2xl">
				<div className="flex justify-between items-start px-6 pb-4 pt-6">
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-primary">
							{masjidInfo.nameEn}
						</h3>
						<div className="flex items-center gap-1.5">
							<svg
								className="w-3 h-3 text-secondary"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<title>Location</title>
								<path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
							</svg>
							<span className="text-sm text-secondary ">
								{masjidInfo.addressEn}
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={handleUnpinMasjid}
						className="rounded-full p-1 hover:bg-muted transition-colors"
						aria-label="Unpin masjid"
					>
						<svg
							className="w-6 h-6 text-accent"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<title>Pin</title>
							<path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
						</svg>
					</button>
				</div>

				<div className="pb-2">
					{prayerTimes.map((prayer, index) => (
						<div key={prayer.name}>
							<PrayerTimeItem
								name={prayer.name}
								dateString={prayer.time}
								isActive={currentPrayer === prayer.name}
								currentTime={currentTime}
							/>
							{index < prayerTimes.length - 1 && (
								<div className="mx-6 h-px bg-border" />
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
