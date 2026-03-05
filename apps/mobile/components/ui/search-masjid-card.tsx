import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useI18n } from "@mobile/hooks/use-i18n";
import {
	MASJID_QUERY_KEYS,
	usePinMasjid,
	useUnpinMasjid,
} from "@mobile/hooks/use-masjid";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import type { Masjid } from "@mobile/lib/api";
import {
	getLocalizedMasjidAddress,
	getLocalizedMasjidName,
	getPrayerName,
} from "@mobile/lib/localization-utils";
import usePinMasjidStore from "@mobile/store/pin-masjid-store";
import {
	cn,
	formatTimeFromISOString,
	getNextPrayerInfo,
	shouldShowEidUlAzhaTimes,
	shouldShowEidUlFitrTimes,
	shouldShowRamadanTimes,
} from "@packages/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
	Alert,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";

interface SearchMasjidCardProps {
	masjid: Masjid;
	isFirst: boolean;
	isLast: boolean;
	className?: string;
}

export function SearchMasjidCard({
	masjid,
	isFirst,
	isLast,
	className,
}: SearchMasjidCardProps) {
	const colors = useThemeColors();
	const { t, getCurrentLanguage } = useI18n();
	const currentLocale = getCurrentLanguage();
	const queryClient = useQueryClient();
	const { mutate: pinMasjid } = usePinMasjid();
	const { mutate: unpinMasjid } = useUnpinMasjid();

	const pinnedMasjidIds = usePinMasjidStore.use.pinnedMasjidIds();

	const isCurrentlyPinned = pinnedMasjidIds.includes(masjid.id);

	const getNextPrayer = () => {
		const currentHijriDate = new Date();
		const showRamadan = shouldShowRamadanTimes(currentHijriDate);
		const showEidUlFitr = shouldShowEidUlFitrTimes(currentHijriDate);
		const showEidUlAzha = shouldShowEidUlAzhaTimes(currentHijriDate);

		const prayerTimes = [
			{ name: "Fajr", time: masjid.fajr },
			{ name: "Dhuhr", time: masjid.dhuhr },
			{ name: "Asr", time: masjid.asr },
			{ name: "Maghrib", time: masjid.maghrib },
			{ name: "Isha", time: masjid.isha },
			{ name: "Jummah", time: masjid.jummah },
		];

		if (showRamadan && masjid.sehar) {
			prayerTimes.push({ name: "Sehar", time: masjid.sehar });
		}
		if (showRamadan && masjid.iftar) {
			prayerTimes.push({ name: "Iftar", time: masjid.iftar });
		}
		if (showEidUlFitr && masjid.eidUlFitr) {
			prayerTimes.push({ name: "Eid Ul Fitr", time: masjid.eidUlFitr });
		}
		if (showEidUlAzha && masjid.eidUlAzha) {
			prayerTimes.push({ name: "Eid Ul Azha", time: masjid.eidUlAzha });
		}

		const { name } = getNextPrayerInfo({
			prayerTimes,
			currentTime: new Date(),
		});
		const timeISOString = prayerTimes.find((p) => p.name === name)?.time;
		const [time, period] = formatTimeFromISOString(timeISOString);
		// const localizedTime = getLocalizedTime(time);
		const localizedPrayerName = getPrayerName(name, t);

		return currentLocale === "en"
			? `${t("search.next")}: ${localizedPrayerName} ${t("search.at")} ${time} ${period}`
			: `${t("search.next")}: ${localizedPrayerName} ${time} ${period} ${t("search.at")}`;
	};

	const handlePinMasjid = () => {
		if (isCurrentlyPinned) {
			// Show confirmation dialog to unpin
			Alert.alert(
				t("search.unpinMasjid"),
				t("search.confirmUnpin", { name: getLocalizedMasjidName(masjid) }),
				[
					{
						text: t("common.cancel"),
						style: "cancel",
					},
					{
						text: t("search.unpin"),
						style: "destructive",
						onPress: () => {
							try {
								unpinMasjid(masjid.id);
								ToastAndroid.show(
									t("search.unpinSuccess", {
										name: getLocalizedMasjidName(masjid),
									}),
									ToastAndroid.SHORT,
								);
							} catch (error) {
								console.error("Error unpinning masjid:", error);
								ToastAndroid.show(t("search.unpinError"), ToastAndroid.SHORT);
							}
						},
					},
				],
			);
		} else {
			// Show confirmation dialog to pin
			Alert.alert(
				t("search.pinMasjid"),
				t("search.confirmPin", { name: getLocalizedMasjidName(masjid) }),
				[
					{
						text: t("common.cancel"),
						style: "cancel",
					},
					{
						text: t("search.pin"),
						onPress: () => {
							try {
								pinMasjid(masjid.id);
								queryClient.setQueryData(MASJID_QUERY_KEYS(masjid.id), {
									success: true,
									data: { ...masjid },
								});
								ToastAndroid.show(
									t("search.pinSuccess", {
										name: getLocalizedMasjidName(masjid),
									}),
									ToastAndroid.SHORT,
								);
							} catch (error) {
								console.error("Error pinning masjid:", error);
								ToastAndroid.show(t("search.pinError"), ToastAndroid.SHORT);
							}
						},
					},
				],
			);
		}
	};

	return (
		<View
			className={cn(
				"bg-card rounded-[5px] space-y-2",
				className,
				isFirst && "rounded-t-2xl",
				isLast ? "rounded-b-2xl" : "mb-[2.5px]",
			)}
		>
			<View className="flex-row justify-between items-start p-4">
				<View className="flex-1 pr-3">
					<Text className="text-xl font-semibold text-primary font-sans">
						{getLocalizedMasjidName(masjid)}
					</Text>
					<Text className="text-base text-secondary font-sans">
						{getLocalizedMasjidAddress(masjid)}
					</Text>
				</View>

				<TouchableOpacity onPress={handlePinMasjid} className="rounded-full">
					<MaterialCommunityIcons
						name={isCurrentlyPinned ? "pin" : "pin-outline"}
						size={24}
						color={colors.accent}
					/>
				</TouchableOpacity>
			</View>

			<View
				className={cn("p-4 pt-2 rounded-[5px] ", isLast && "rounded-b-2xl")}
			>
				<Text className="text-lg font-sans text-accent font-medium">
					{getNextPrayer()}
				</Text>
			</View>
		</View>
	);
}
