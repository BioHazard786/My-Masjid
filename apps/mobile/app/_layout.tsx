import "@mobile/global.css";
import { useNotifications } from "@mobile/hooks/use-notifications";
import { themes as colorTheme } from "@mobile/hooks/use-theme-color";
import { themes } from "@mobile/lib/color-theme";
import "@mobile/lib/i18n"; // Initialize i18n
import { persister, queryClient } from "@mobile/lib/query-client";
import type { Theme } from "@react-navigation/native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";

// Custom themes that override React Navigation defaults
const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colorTheme.light.background,
    card: colorTheme.light.card,
    primary: colorTheme.light.primary,
    border: colorTheme.light.border,
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colorTheme.dark.background,
    card: colorTheme.dark.card,
    primary: colorTheme.dark.primary,
    border: colorTheme.dark.border,
  },
};

function AppContent() {
  const colorScheme = useColorScheme();
  // Initialize notifications after query client is available
  useNotifications();

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
    >
      <View
        style={themes[colorScheme === "dark" ? "dark" : "light"]}
        className="flex-1"
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="masjid/[id]" options={{ headerShown: false }} />
        </Stack>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24 * 24, // 24 days
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            query.queryKey[0] === "persist" ? true : false,
        },
      }}
      onSuccess={() => {
        // Resume rendering on success
        queryClient.resumePausedMutations();
      }}
    >
      <AppContent />
      {/* <DevToolsBubble queryClient={queryClient} /> */}
    </PersistQueryClientProvider>
  );
}
