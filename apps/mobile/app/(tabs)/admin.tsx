import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@mobile/hooks/use-auth";
import { useI18n } from "@mobile/hooks/use-i18n";
import {
	useMasjidProfile,
	useUpdatePrayerTimes,
} from "@mobile/hooks/use-masjid";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import {
	getLocalizedMasjidName,
	getLocalizedNA,
	getLocalizedPeriod,
	getPrayerName,
} from "@mobile/lib/localization-utils";
import { cn, formatTimeFromISOString } from "@packages/utils";
import type { prayerTimesSchema } from "@packages/validators";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Redirect } from "expo-router";
import { useEffect, useReducer, useRef, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { z } from "zod";

// Prayer times configuration
const initialPrayerTimes = [
	{ name: "Fajr", dbKey: "fajr" },
	{ name: "Dhuhr", dbKey: "dhuhr" },
	{ name: "Asr", dbKey: "asr" },
	{ name: "Maghrib", dbKey: "maghrib" },
	{ name: "Isha", dbKey: "isha" },
	{ name: "Jummah", dbKey: "jummah" },
];

type PrayerTimesData = z.infer<typeof prayerTimesSchema>;

type PrayerTimesAction =
	| { type: "SET_PRAYER_TIME"; field: keyof PrayerTimesData; value: string }
	| { type: "INITIALIZE_TIMES"; prayerTimes: PrayerTimesData }
	| { type: "RESET_TO_ORIGINAL" };

// Reducer function
const prayerTimesReducer = (
	state: PrayerTimesData,
	action: PrayerTimesAction,
): PrayerTimesData => {
	switch (action.type) {
		case "SET_PRAYER_TIME":
			return {
				...state,
				[action.field]: action.value,
			};
		case "INITIALIZE_TIMES":
			return action.prayerTimes;
		case "RESET_TO_ORIGINAL":
			return state; // This will be handled by resetting to originalTimesRef.current
		default:
			return state;
	}
};

const Header = ({ masjidName }: { masjidName: string }) => {
	const { t } = useI18n();
	// const [isSigningOut, setIsSigningOut] = useState(false);

	// const handleSignOut = async () => {
	//   Alert.alert("Sign Out", "Are you sure you want to sign out?", [
	//     { text: "Cancel", style: "cancel" },
	//     {
	//       text: "Sign Out",
	//       style: "destructive",
	//       onPress: async () => {
	//         setIsSigningOut(true);
	//         try {
	//           await authClient.signOut();
	//           router.replace("/");
	//         } catch (error) {
	//           console.log(error);
	//           Alert.alert("Error", "Failed to sign out");
	//         } finally {
	//           setIsSigningOut(false);
	//         }
	//       },
	//     },
	//   ]);
	// };

	return (
		<View className="px-6 pt-8 pb-6">
			<View className="flex-row items-center justify-between">
				<View>
					<Text className="text-sm text-secondary uppercase tracking-wider font-medium font-sans">
						{t("admin.dashboard")}
					</Text>
					<Text
						className="text-4xl font-bold text-primary mt-1 font-sans"
						style={{ lineHeight: 40 }}
					>
						{masjidName || getLocalizedNA(t)}
					</Text>
				</View>
				{/* <Pressable
          onPress={handleSignOut}
          className="bg-red-500 px-4 py-2 rounded-lg flex-row items-center"
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={16} color="white" />
              <Text className="text-white font-medium ml-2">Sign Out</Text>
            </>
          )}
        </Pressable> */}
			</View>
		</View>
	);
};

const InstructionCard = ({ hasChanges }: { hasChanges: boolean }) => {
	const { t } = useI18n();

	return (
		<View className="py-16 flex items-center justify-center px-6">
			<Text className="text-primary text-xl font-bold font-sans text-center mb-2">
				{t("admin.managePrayerTimes")}
			</Text>
			<Text className="text-secondary font-sans text-base text-center">
				{t("admin.tapToUpdate")}
			</Text>
			{hasChanges && (
				<View className="mt-8 bg-accent-background rounded-lg p-4">
					<Text className="text-accent font-sans text-base text-center">
						{t("admin.unsavedChanges")}
					</Text>
				</View>
			)}
		</View>
	);
};

const PrayerTimeItem = ({
	name,
	dateString,
	onTimePress,
	hasChanged,
}: {
	name: string;
	dateString: string | null | undefined;
	onTimePress: () => void;
	hasChanged?: boolean;
}) => {
	const [time, period] = formatTimeFromISOString(dateString);
	const { t } = useI18n();

	return (
		<Pressable
			className="flex-row justify-between items-center rounded-full p-6"
			onPress={onTimePress}
		>
			<View className="flex-1 flex-row items-center">
				<Text
					className={cn(
						"text-2xl font-sans",
						hasChanged ? "text-primary" : "text-secondary",
					)}
				>
					{getPrayerName(name, t)}
				</Text>
				{hasChanged && <View className="ml-2 bg-accent rounded-full w-2 h-2" />}
			</View>
			<View className="flex-row items-baseline">
				{time ? (
					<>
						<Text
							className={cn(
								"text-2xl font-bold font-sans",
								hasChanged ? "text-primary" : "text-secondary",
							)}
						>
							{time}
						</Text>
						<Text
							className={cn(
								"text-base font-bold ml-1 font-sans",
								hasChanged ? "text-primary" : "text-secondary",
							)}
						>
							{getLocalizedPeriod(period)}
						</Text>
					</>
				) : (
					<Text className="text-2xl font-bold font-sans text-secondary">
						{t("admin.notSet")}
					</Text>
				)}
			</View>
		</Pressable>
	);
};

export default function ImamDashboard() {
	const colors = useThemeColors();
	const { t } = useI18n();
	const { user: masjid } = useAuth();
	const [refreshing, setRefreshing] = useState(false);

	if (!masjid) {
		return <Redirect href="/" />;
	}

	// React Query hooks
	const {
		data: masjidProfile,
		isLoading: profileLoading,
		error: profileError,
		refetch: refetchProfile,
	} = useMasjidProfile(masjid.id);

	const defaultPrayerTimes: PrayerTimesData = {
		fajr: masjidProfile?.fajr,
		dhuhr: masjidProfile?.dhuhr,
		asr: masjidProfile?.asr,
		maghrib: masjidProfile?.maghrib,
		isha: masjidProfile?.isha,
		jummah: masjidProfile?.jummah,
	};

	const updatePrayerTimesMutation = useUpdatePrayerTimes(masjid.id);

	// Use useReducer for prayer times state management
	const [prayerTimes, dispatch] = useReducer(
		prayerTimesReducer,
		defaultPrayerTimes,
	);

	// Use useRef to track original values without causing re-renders
	const originalTimesRef = useRef<PrayerTimesData>(defaultPrayerTimes);

	// Check if values have changed
	const hasChanges = Object.keys(prayerTimes).some(
		(key) =>
			prayerTimes[key as keyof PrayerTimesData] !==
			originalTimesRef.current[key as keyof PrayerTimesData],
	);

	const canSubmit = hasChanges && !updatePrayerTimesMutation.isPending;

	const handleSubmit = async () => {
		// Only submit the changed fields
		const changedFields: Partial<PrayerTimesData> = {};

		Object.entries(prayerTimes).forEach(([key, newValue]) => {
			const originalValue =
				originalTimesRef.current[key as keyof PrayerTimesData];
			if (originalValue !== newValue) {
				changedFields[key as keyof PrayerTimesData] = newValue as string;
			}
		});

		if (Object.keys(changedFields).length === 0) {
			ToastAndroid.show(t("admin.noChangesToSave"), ToastAndroid.SHORT);
			return;
		}

		await updatePrayerTimesMutation.mutateAsync(changedFields);
		// Update original values after successful submission
		originalTimesRef.current = prayerTimes;
	};

	const handleDiscardChanges = () => {
		dispatch({
			type: "INITIALIZE_TIMES",
			prayerTimes: originalTimesRef.current,
		});
		ToastAndroid.show(t("admin.changesDiscarded"), ToastAndroid.SHORT);
	};

	const handleTimeChange = (dbKey: keyof PrayerTimesData) => {
		const currentValue = prayerTimes[dbKey];
		const initialDate = currentValue ? new Date(currentValue) : new Date();

		try {
			DateTimePickerAndroid.open({
				value: initialDate,
				onChange: async (event, selectedDate) => {
					if (event.type === "set" && selectedDate) {
						dispatch({
							type: "SET_PRAYER_TIME",
							field: dbKey,
							value: selectedDate.toISOString(),
						});
					}
				},
				mode: "time",
				is24Hour: false,
			});
		} catch (error) {
			console.error("Time picker error:", error);
			ToastAndroid.show(t("admin.timePickerError"), ToastAndroid.SHORT);
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			await refetchProfile();
		} catch (error) {
			console.error("Refresh failed:", error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (masjidProfile) {
			const newPrayerTimes: PrayerTimesData = {
				fajr: masjidProfile.fajr,
				dhuhr: masjidProfile.dhuhr,
				asr: masjidProfile.asr,
				maghrib: masjidProfile.maghrib,
				isha: masjidProfile.isha,
				jummah: masjidProfile.jummah,
			};

			// Update both the reducer state and the original reference
			dispatch({ type: "INITIALIZE_TIMES", prayerTimes: newPrayerTimes });
			originalTimesRef.current = newPrayerTimes;
		}
	}, [masjidProfile]);

	if (profileLoading) {
		return (
			<SafeAreaView className="flex-1 bg-background items-center justify-center">
				<ActivityIndicator size="large" color={colors.accent} />
			</SafeAreaView>
		);
	}

	if (profileError) {
		return (
			<SafeAreaView className="flex bg-background">
				<View className="flex items-center justify-center px-6">
					<Ionicons
						name="alert-circle-outline"
						size={48}
						color={colors.secondary}
					/>
					<Text className="text-primary text-lg font-semibold font-sans mt-4 text-center">
						{t("admin.errorLoading")}
					</Text>
					<Text className="text-secondary mt-2 text-center font-sans">
						{t("admin.checkConnection")}
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<ScrollView
				className="flex-1"
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
			>
				<Header masjidName={getLocalizedMasjidName(masjidProfile ?? null)} />
				<InstructionCard hasChanges={hasChanges} />

				<View className="flex-1 px-6 space-y-3">
					{initialPrayerTimes.map((prayer, index) => {
						const currentValue =
							prayerTimes[prayer.dbKey as keyof PrayerTimesData];
						const originalValue =
							originalTimesRef.current[prayer.dbKey as keyof PrayerTimesData];
						const hasChanged = currentValue !== originalValue;

						return (
							<View key={prayer.name}>
								<PrayerTimeItem
									name={prayer.name}
									dateString={currentValue}
									hasChanged={hasChanged}
									onTimePress={() =>
										handleTimeChange(prayer.dbKey as keyof PrayerTimesData)
									}
								/>
								{index < initialPrayerTimes.length - 1 && (
									<View className="mx-6 h-px bg-border" />
								)}
							</View>
						);
					})}
				</View>

				{/* Submit Button */}
				<View className="px-6 pt-6 pb-2">
					<Pressable
						className={cn(
							"rounded-full py-4 px-6 flex-row items-center justify-center",
							canSubmit ? "bg-accent" : "bg-gray-300 dark:bg-gray-600",
						)}
						onPress={handleSubmit}
						disabled={!canSubmit}
					>
						{updatePrayerTimesMutation.isPending ? (
							<ActivityIndicator size="small" color={colors.background} />
						) : (
							<Ionicons
								name={hasChanges ? "checkmark-circle" : "close-circle"}
								size={20}
								color={colors.background}
							/>
						)}
						<Text className="text-background text-center font-semibold text-base font-sans ml-2">
							{updatePrayerTimesMutation.isPending
								? t("admin.updating")
								: hasChanges
									? t("admin.updatePrayerTimes")
									: t("admin.noChanges")}
						</Text>
					</Pressable>

					{hasChanges && (
						<Pressable
							className="mt-3 py-2 px-4 flex-row items-center justify-center"
							onPress={handleDiscardChanges}
						>
							<Ionicons name="refresh" size={18} color={colors.secondary} />
							<Text className="text-secondary text-center font-semibold text-base font-sans ml-2">
								{t("admin.discardChanges")}
							</Text>
						</Pressable>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
