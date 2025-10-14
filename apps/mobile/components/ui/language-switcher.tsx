import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@mobile/hooks/use-i18n";
import { useChangePreferredLanguage } from "@mobile/hooks/use-masjid";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import { cn } from "@packages/utils";
import { MenuView } from "@react-native-menu/menu";
import { Text, View } from "react-native";

interface LanguageSwitcherProps {
	className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
	const colors = useThemeColors();
	const { mutate: server_changePreferredLanguage } =
		useChangePreferredLanguage();
	const { t, changeLanguage, getCurrentLanguage, getLanguageLabel } = useI18n();
	const currentLanguage = getCurrentLanguage();

	return (
		<MenuView
			onPressAction={({ nativeEvent }) => {
				const selectedLanguage = nativeEvent.event;
				if (currentLanguage === selectedLanguage) return;
				changeLanguage(selectedLanguage);
				server_changePreferredLanguage(selectedLanguage);
			}}
			title={t("common.language")}
			actions={[
				{
					id: "en",
					title: getLanguageLabel("en"),
					state: currentLanguage === "en" ? "on" : "off",
				},
				{
					id: "hi",
					title: getLanguageLabel("hi"),
					state: currentLanguage === "hi" ? "on" : "off",
				},
				{
					id: "ur",
					title: getLanguageLabel("ur"),
					state: currentLanguage === "ur" ? "on" : "off",
				},
			]}
		>
			<View
				className={cn(
					"flex-row items-center justify-center bg-card p-3 rounded-lg",
					className,
				)}
			>
				<Ionicons name="language" size={20} color={colors.accent} />
				<Text className="text-primary font-sans ml-2">
					{getLanguageLabel(currentLanguage)}
				</Text>
				<Ionicons
					name="chevron-down"
					size={16}
					color={colors.secondary}
					style={{ marginLeft: 4 }}
				/>
			</View>

			{/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-primary font-sans">
                {t("common.language")}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} className="p-2">
                <Ionicons name="close" size={24} color={colors.secondary} />
              </Pressable>
            </View>

            <View className="gap-3">
              {availableLanguages.map((language) => (
                <Pressable
                  key={language}
                  onPress={() => handleLanguageChange(language)}
                  className={cn(
                    "flex-row items-center p-4 rounded-lg",
                    currentLanguage === language ? "bg-accent/10" : "bg-card"
                  )}
                >
                  <Text className="text-lg font-sans text-primary flex-1">
                    {getLanguageLabel(language)}
                  </Text>
                  {currentLanguage === language && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.accent}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal> */}
		</MenuView>
	);
}
