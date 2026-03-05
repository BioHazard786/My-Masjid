import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useI18n } from "@mobile/hooks/use-i18n";
import { usePrayerTimes, useUnpinMasjid } from "@mobile/hooks/use-masjid";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import { getConsistentPrayerBackground } from "@mobile/lib/bg-utils";
import {
	getLocalizedMasjidAddress,
	getLocalizedMasjidName,
	getLocalizedNA,
	getPrayerName,
} from "@mobile/lib/localization-utils";
import {
	cn,
	formatPrayerTime,
	formatTimeFromISOString,
	getCurrentPrayer,
	getRelativeTimeToNow,
	shouldShowEidUlAzhaTimes,
	shouldShowEidUlFitrTimes,
	shouldShowRamadanTimes,
} from "@packages/utils";
import { ImageBackground } from "expo-image";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";

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
	const { t } = useI18n();
	const [showRelativeTime, setShowRelativeTime] = useState(false);
	const [time, period] = formatTimeFromISOString(dateString);
	const relativeTime = getRelativeTimeToNow(dateString, currentTime);

	const handleToggleTimeFormat = () => {
		setShowRelativeTime(!showRelativeTime);
	};

	return (
		<View className="flex-row justify-between items-center rounded-full p-6 py-4">
			<View className="flex-1 flex-row items-center gap-2">
				<Text
					className={cn(
						"text-xl font-sans",
						isActive ? "text-primary" : "text-secondary",
					)}
				>
					{getPrayerName(name, t)}
				</Text>
			</View>
			<Pressable onPress={handleToggleTimeFormat}>
				<View className="flex-row items-baseline">
					{time ? (
						showRelativeTime && relativeTime ? (
							<Text
								className={cn(
									"text-xl font-bold font-sans",
									isActive ? "text-primary" : "text-secondary",
								)}
							>
								{relativeTime}
							</Text>
						) : (
							<>
								<Text
									className={cn(
										"text-xl font-bold font-sans",
										isActive ? "text-primary" : "text-secondary",
									)}
								>
									{time}
								</Text>
								<Text
									className={cn(
										"text-sm font-bold ml-1 font-sans",
										isActive ? "text-primary" : "text-secondary",
									)}
								>
									{period}
								</Text>
							</>
						)
					) : (
						<Text className="text-xl font-bold font-sans text-secondary">
							{getLocalizedNA(t)}
						</Text>
					)}
				</View>
			</Pressable>
		</View>
	);
};

export function PinMasjidCard({ masjidId, className }: PinMasjidCardProps) {
	const colors = useThemeColors();
	const { mutate: unpinMasjid } = useUnpinMasjid();
	const { t } = useI18n();

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

	// Filter prayer times based on Hijri date
	const currentHijriDate = new Date();
	const showRamadan = shouldShowRamadanTimes(currentHijriDate);
	const showEidUlFitr = shouldShowEidUlFitrTimes(currentHijriDate);
	const showEidUlAzha = shouldShowEidUlAzhaTimes(currentHijriDate);

	const finalPrayerTimes = [...prayerTimes];

	// Insert Sehar at start (before Fajr)
	if (showRamadan && masjidInfo?.sehar) {
		finalPrayerTimes.unshift({ name: "Sehar", time: masjidInfo.sehar });
	}

	// Insert Iftar after Asr (before Maghrib)
	if (showRamadan && masjidInfo?.iftar) {
		const maghribIndex = finalPrayerTimes.findIndex((p) => p.name === "Maghrib");
		if (maghribIndex !== -1) {
			finalPrayerTimes.splice(maghribIndex, 0, { name: "Iftar", time: masjidInfo.iftar });
		} else {
			finalPrayerTimes.push({ name: "Iftar", time: masjidInfo.iftar });
		}
	}

	// Eid times
	if (showEidUlFitr && masjidInfo?.eidUlFitr) {
		// Eid is usually morning/forenoon. Add after Fajr.
		const dhuhrIndex = finalPrayerTimes.findIndex((p) => p.name === "Dhuhr" || p.name === "Jummah");
		if (dhuhrIndex !== -1) {
			finalPrayerTimes.splice(dhuhrIndex, 0, { name: "Eid Ul Fitr", time: masjidInfo.eidUlFitr });
		} else {
			finalPrayerTimes.push({ name: "Eid Ul Fitr", time: masjidInfo.eidUlFitr });
		}
	}
    
    if (showEidUlAzha && masjidInfo?.eidUlAzha) {
		const dhuhrIndex = finalPrayerTimes.findIndex((p) => p.name === "Dhuhr" || p.name === "Jummah");
		if (dhuhrIndex !== -1) {
			finalPrayerTimes.splice(dhuhrIndex, 0, { name: "Eid Ul Azha", time: masjidInfo.eidUlAzha });
		} else {
			finalPrayerTimes.push({ name: "Eid Ul Azha", time: masjidInfo.eidUlAzha });
		}
	}

	const currentPrayer = getCurrentPrayer(finalPrayerTimes, currentTime);

	// Get dynamic background based on current prayer and masjid ID
	const backgroundImage = getConsistentPrayerBackground(
		currentPrayer,
		masjidId,
	);

	if (isLoading) {
		return (
			<View className="border-border border rounded-2xl mx-6">
				<View className="w-full h-48 rounded-t-2xl bg-card" />
				<View className="flex-1 w-full h-64 items-center justify-center">
					<ActivityIndicator size="large" color={colors.accent} />
				</View>
			</View>
		);
	}

	if (error || !masjidInfo) {
		return <Text>{t("errors.loadingFailed")}</Text>;
	}

	const handleUnpinMasjid = () => {
		Alert.alert(
			t("masjid.unpin"),
			`${t("common.confirmAction")} ${getLocalizedMasjidName(masjidInfo)}?`,
			[
				{
					text: t("common.cancel"),
					style: "cancel",
				},
				{
					text: t("masjid.unpin"),
					style: "destructive",
					onPress: () => {
						try {
							unpinMasjid(masjidInfo.id);
							ToastAndroid.show(
								`${getLocalizedMasjidName(masjidInfo)} ${t("masjid.unpinned")}!`,
								ToastAndroid.SHORT,
							);
						} catch (error) {
							console.error("Error unpinning masjid:", error);
							ToastAndroid.show(t("errors.unknownError"), ToastAndroid.SHORT);
						}
					},
				},
			],
		);
	};

	return (
		<View className={cn("bg-card rounded-2xl space-y-2", className)}>
			<ImageBackground
				transition={300}
				source={backgroundImage}
				contentFit="cover"
				imageStyle={{
					borderRadius: 16,
					borderBottomLeftRadius: 0,
					borderBottomRightRadius: 0,
				}}
			>
				<View className="w-full h-48 rounded-t-2xl" />
			</ImageBackground>
			<View className="rounded-b-2xl">
				<View className="flex-row justify-between items-start px-6 pb-4 pt-6">
					<View className="flex-1">
						<Text className="text-xl font-semibold text-primary font-sans">
							{getLocalizedMasjidName(masjidInfo)}
						</Text>
						<View className="flex-row items-center gap-1.5">
							<Ionicons name="navigate" size={13} color={colors.secondary} />
							<Text className="text-base text-secondary font-sans">
								{getLocalizedMasjidAddress(masjidInfo)}
							</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleUnpinMasjid}
						className="rounded-full"
					>
						<MaterialCommunityIcons
							name="pin"
							size={24}
							color={colors.accent}
						/>
					</TouchableOpacity>
				</View>

				<View className="pb-2">
					{finalPrayerTimes.map((prayer, index) => (
						<View key={prayer.name}>
							<PrayerTimeItem
								name={prayer.name}
								dateString={prayer.time}
								isActive={currentPrayer === prayer.name}
								currentTime={currentTime}
							/>
							{index < finalPrayerTimes.length - 1 && (
								<View className="mx-6 h-px bg-tertiary" />
							)}
						</View>
					))}
				</View>
			</View>
		</View>
	);
}
