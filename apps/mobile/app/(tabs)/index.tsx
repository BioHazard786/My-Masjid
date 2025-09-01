import { PinMasjidCard } from "@/apps/mobile/components/ui/pin-masjid-card";
import { Ionicons } from "@expo/vector-icons";
import { LegendList, type LegendListRenderItemProps } from "@legendapp/list";
import { LanguageSwitcher } from "@mobile/components/ui/language-switcher";
import { useI18n } from "@mobile/hooks/use-i18n";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import usePinMasjidStore from "@mobile/store/pin-masjid-store";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  const { t } = useI18n();
  const [tapCount, setTapCount] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const handleLogoTap = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTapCount((prev) => prev + 1);

    // Reset tap count after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000) as unknown as number;

    // Navigate to auth if tapped 5 times
    if (tapCount + 1 >= 5) {
      setTapCount(0);
      router.push("/auth/sign-in");
    }
  };

  return (
    <View className="px-6 py-8">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={handleLogoTap}>
          <Text
            className="text-4xl font-bold text-primary pt-1 font-sans"
            style={{ lineHeight: 40 }}
          >
            {t("home.title")}
          </Text>
        </Pressable>
        <LanguageSwitcher />
      </View>
    </View>
  );
};

export default function Home() {
  const { t } = useI18n();
  const colors = useThemeColors();
  const pinnedMasjidIds = usePinMasjidStore.use.pinnedMasjidIds();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const handleMasjidPress = (masjidId: string) => {
    router.push({
      pathname: "/masjid/[id]",
      params: { id: masjidId },
    });
  };

  const renderMasjidItem = ({
    item: masjidId,
  }: LegendListRenderItemProps<string>) => (
    <Pressable onPress={() => handleMasjidPress(masjidId)}>
      <PinMasjidCard masjidId={masjidId} className="mx-6" />
    </Pressable>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="bookmarks-outline" size={64} color={colors.secondary} />
      <Text className="text-xl font-semibold text-primary mb-2 font-sans mt-4">
        {t("home.noPinnedMasjids")}
      </Text>
      <Text className="text-secondary font-sans text-center">
        {t("home.searchAndPin")}
      </Text>
    </View>
  );

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["persist", "masjid"] });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Header />
      <LegendList
        data={pinnedMasjidIds}
        keyExtractor={(item) => item}
        renderItem={renderMasjidItem}
        maintainVisibleContentPosition
        contentContainerStyle={{
          paddingBottom: 24,
          flexGrow: 1,
          gap: 24,
        }}
        estimatedItemSize={20}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}
