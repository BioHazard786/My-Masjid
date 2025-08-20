import { Ionicons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { SearchMasjidCard } from "@mobile/components/ui/search-masjid-card";
import { useDebounce } from "@mobile/hooks/use-debounce";
import { useI18n } from "@mobile/hooks/use-i18n";
import { useSearchMasjids } from "@mobile/hooks/use-masjid";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import type { Masjid } from "@mobile/lib/api";
import * as React from "react";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const { t } = useI18n();
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = React.useState("");
  // const pinMasjidMutation = usePinMasjid(); // Commented out since we're using local storage

  // Use custom debounce hook
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Use TanStack Query for search
  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useSearchMasjids(debouncedQuery);

  const renderMasjidItem = ({
    masjid,
    isFirst,
    isLast,
  }: {
    masjid: Masjid;
    isFirst: boolean;
    isLast: boolean;
  }) => <SearchMasjidCard masjid={masjid} isFirst={isFirst} isLast={isLast} />;

  const renderEmptyState = () => {
    if (searchQuery.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="search-circle" size={64} color={colors.secondary} />
          <Text className="text-xl font-semibold text-primary mb-2 font-sans">
            {t("search.title")}
          </Text>
          <Text className="text-secondary font-sans text-center">
            {t("search.startSearching")}
          </Text>
        </View>
      ); // Show mock data instead of empty state when no search
    }

    if (searchResults.length === 0 && !isLoading) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-semibold text-primary font-sans mb-2">
            {t("search.noResults")}
          </Text>
          <Text className="text-secondary font-sans text-center">
            {t("search.tryDifferentSearch")}
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-xl font-sans font-semibold text-primary mb-2">
        Search Error
      </Text>
      <Text className="text-secondary text-center font-sans">
        {error?.message ||
          "Unable to search. Please check your connection and try again."}
      </Text>
      <TouchableOpacity
        onPress={() => setSearchQuery("")}
        className="mt-4 bg-accent px-4 py-2 rounded-full"
      >
        <Text className="text-background font-medium">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View className="flex-1 bg-background">
          {/* Search Header */}
          <View className="relative mx-6 mt-8 mb-6">
            {/* Search Icon */}
            <View
              className="absolute left-4 top-1/2 z-10"
              style={{ transform: [{ translateY: -10 }] }}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.secondary}
              />
            </View>

            <TextInput
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="h-14 pl-[3.5rem] pr-12 rounded-full text-primary bg-card font-sans"
              placeholderTextColor={colors.secondary}
              cursorColor={colors.accent}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
              style={{ includeFontPadding: false, textAlignVertical: "center" }}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />

            {/* Right side icons */}
            <View
              className="absolute right-4 top-1/2 z-10"
              style={{ transform: [{ translateY: -10 }] }}
            >
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close" size={20} color={colors.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Loading indicator in main area */}
          {isLoading && (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          )}

          {/* Search Results */}
          {!isLoading && error ? (
            renderErrorState()
          ) : !isLoading ? (
            <LegendList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) =>
                renderMasjidItem({
                  masjid: item,
                  isFirst: index === 0,
                  isLast: index === searchResults.length - 1,
                })
              }
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingVertical: 16,
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
              keyboardShouldPersistTaps="handled"
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
