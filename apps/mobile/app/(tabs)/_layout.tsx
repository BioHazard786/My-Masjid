import { Tabs } from "@mobile/components/navigation/bottom-tabs";
import { useAuth } from "@mobile/hooks/use-auth";
import { useI18n } from "@mobile/hooks/use-i18n";
import { useThemeColors } from "@mobile/hooks/use-theme-color";

export default function TabLayout() {
  // Check if user is authenticated using our auth context
  const { t } = useI18n();
  const colors = useThemeColors();
  const { isAuthenticated } = useAuth();

  return (
    <Tabs
      activeIndicatorColor={colors.card}
      tabBarInactiveTintColor={colors.secondary}
      tabBarStyle={{
        backgroundColor: colors.background,
      }}
      tabLabelStyle={{
        fontFamily: "Poppins",
      }}
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navigation.home"),

          tabBarIcon: ({ focused }) =>
            focused
              ? require("@mobile/assets/icons/home-solid.png")
              : require("@mobile/assets/icons/home.png"),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("navigation.search"),
          tabBarIcon: () => require("@mobile/assets/icons/search.png"),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: t("navigation.admin"),
          tabBarItemHidden: !isAuthenticated,
          tabBarIcon: ({ focused }) =>
            focused
              ? require("@mobile/assets/icons/user-solid.png")
              : require("@mobile/assets/icons/user.png"),
        }}
      />
    </Tabs>
  );
}
