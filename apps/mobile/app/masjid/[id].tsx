import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@mobile/hooks/use-i18n";
import { usePrayerTimes } from "@mobile/hooks/use-masjid";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import {
  getLocalizedMasjidAddress,
  getLocalizedMasjidName,
  getLocalizedNA,
  getLocalizedPeriod,
  getLocalizedTimeLeft,
  getPrayerName,
} from "@mobile/lib/localization-utils";
import {
  formatPrayerTime,
  getCurrentPrayer,
  getNextPrayerInfo,
} from "@mobile/lib/prayer-utils";
import { formatTimeFromISOString } from "@mobile/lib/time-utils";
import { cn } from "@mobile/lib/utils";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getConsistentPrayerBackground } from "../../lib/background-utils";

const Header = ({
  masjidName,
  masjidLocation,
}: {
  masjidName?: string;
  masjidLocation?: string;
}) => {
  const colors = useThemeColors();
  const { t } = useI18n();

  return (
    <View className="px-6 py-8">
      <View className="flex-row items-center gap-1.5">
        <Ionicons name="navigate" size={13} color={colors.secondary} />
        <Text className="text-sm text-secondary uppercase tracking-wider font-medium font-sans">
          {masjidLocation || getLocalizedNA(t)}
        </Text>
      </View>
      <Text
        className="text-4xl font-bold text-primary font-sans mt-1"
        style={{ lineHeight: 40 }}
      >
        {masjidName || getLocalizedNA(t)}
      </Text>
    </View>
  );
};

const NextPrayerCard = ({
  prayerTimes,
  currentTime,
}: {
  prayerTimes: { name: string; time: string | null }[];
  currentTime: Date;
}) => {
  const nextPrayer = getNextPrayerInfo({ prayerTimes, currentTime });
  const { t, getCurrentLanguage } = useI18n();
  const currentLocale = getCurrentLanguage();
  return (
    <View className="py-24 flex items-center justify-between">
      <Text className="text-primary text-2xl font-bold font-sans">
        {t("common.next")}: {getPrayerName(nextPrayer.name, t)}
      </Text>
      <Text className="text-secondary font-sans text-xl mt-1 px-4 py-2 rounded-full bg-card">
        {currentLocale === "en"
          ? `${t("time.in")} ${getLocalizedTimeLeft(nextPrayer.timeLeft, t)}`
          : `${getLocalizedTimeLeft(nextPrayer.timeLeft, t)} ${t("time.in")}`}
      </Text>
    </View>
  );
};

const PrayerTimeItem = ({
  name,
  dateString,
  isActive,
}: {
  name: string;
  dateString: string | null;
  isActive?: boolean;
}) => {
  const [time, period] = formatTimeFromISOString(dateString);
  const { t } = useI18n();

  return (
    <View className="flex-row justify-between items-center rounded-full p-6">
      <View className="flex-1">
        <Text
          className={cn(
            "text-2xl font-sans",
            isActive ? "text-primary" : "text-secondary"
          )}
        >
          {getPrayerName(name, t)}
        </Text>
      </View>
      <View className="flex-row items-baseline">
        {time ? (
          <>
            <Text
              className={cn(
                "text-2xl font-bold font-sans",
                isActive ? "text-primary" : "text-secondary"
              )}
            >
              {time}
            </Text>
            <Text
              className={cn(
                "text-base font-bold ml-1 font-sans",
                isActive ? "text-primary" : "text-secondary"
              )}
            >
              {getLocalizedPeriod(period)}
            </Text>
          </>
        ) : (
          <Text className="text-2xl font-bold font-sans text-secondary">
            {getLocalizedNA(t)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default function MasjidScreen() {
  const { id: masjidID } = useLocalSearchParams();

  if (!masjidID) return <Redirect href="/" />;

  const colors = useThemeColors();
  const { height } = Dimensions.get("window");
  const {
    data: prayerData,
    masjid: masjidInfo,
    isLoading,
    error,
    refetch,
  } = usePrayerTimes(masjidID as string);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Update current time every minute for real-time prayer tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Transform prayer times for display (replace Dhuhr with Jummah on Friday)
  const prayerTimes = formatPrayerTime(prayerData);

  const currentPrayer = getCurrentPrayer(prayerTimes, currentTime);

  const backgroundImage = getConsistentPrayerBackground(
    currentPrayer,
    masjidID as string
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex bg-background">
        <View className="flex items-center justify-center px-6">
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.secondary}
          />
          <Text className="text-primary text-lg font-semibold font-sans mt-4 text-center">
            Error Loading Masjid Data
          </Text>
          <Text className="text-secondary mt-2 text-center font-sans">
            Please check your connection and try again
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      {/* Background Image with Gradient Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <ImageBackground
          transition={300}
          source={backgroundImage}
          contentFit="cover"
        >
          <View
            style={{
              height: Math.round(height / 3),
            }}
          />
          <LinearGradient
            colors={[`${colors.background}aa`, colors.background]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </ImageBackground>
      </View>

      {/* Content */}
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <Header
            masjidName={getLocalizedMasjidName(masjidInfo)}
            masjidLocation={getLocalizedMasjidAddress(masjidInfo)}
          />
          <NextPrayerCard prayerTimes={prayerTimes} currentTime={currentTime} />
          <View className="flex-1 px-6">
            {prayerTimes.map((prayer, index) => (
              <View key={prayer.name}>
                <PrayerTimeItem
                  name={prayer.name}
                  dateString={prayer.time}
                  isActive={currentPrayer === prayer.name}
                />
                {index < prayerTimes.length - 1 && (
                  <View className="mx-6 h-px bg-border" />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
