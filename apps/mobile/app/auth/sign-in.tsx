import { authClient } from "@/apps/mobile/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@mobile/hooks/use-i18n";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import { cn } from "@mobile/lib/utils";
import { useForm, useStore } from "@tanstack/react-form";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

export default function SignInScreen() {
  const { t } = useI18n();
  const colors = useThemeColors();

  const signInSchema = z.object({
    email: z.email(t("auth.invalidEmail")),
    password: z.string().min(1, t("auth.passwordRequired")),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value: formValue }) => {
      const trimmedValue = Object.fromEntries(
        Object.entries(formValue).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );

      const parsedValue = signInSchema.safeParse(trimmedValue);

      if (!parsedValue.success) {
        console.log("Validation errors:", parsedValue.error);
        ToastAndroid.show(t("auth.fixFormErrors"), ToastAndroid.SHORT);
        return;
      }

      const value = parsedValue.data;

      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });
      if (error) {
        console.log(error);
        ToastAndroid.show(
          error?.message || t("auth.signInError"),
          ToastAndroid.SHORT
        );
        form.reset();
      } else {
        router.dismissAll();
      }
    },
    validators: {
      onChange: signInSchema,
    },
  });

  const [canSubmit, isSubmitting] = useStore(form.store, (state) => [
    state.canSubmit,
    state.isSubmitting,
  ]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-12 py-8">
          {/* Header */}
          <View className="mb-8 items-center">
            <View className="size-16 bg-card rounded-full items-center justify-center mb-3">
              <Ionicons name="log-in" size={32} color={colors.accent} />
            </View>
            <Text className="text-3xl font-bold text-primary mb-2 font-sans text-center" style={{ lineHeight: 40 }}>
              {t("auth.welcomeBack")}
            </Text>
            <Text className="text-secondary text-base font-sans text-center max-w-sm">
              {t("auth.signInSubtitle")}
            </Text>
          </View>

          {/* Form */}
          <View className="flex gap-7">
            {/* Email Field */}
            <form.Field name="email">
              {(field) => (
                <View>
                  <Text className="text-primary text-base font-medium font-sans mb-2">
                    {t("auth.email")}
                  </Text>
                  <TextInput
                    id={field.name}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-primary text-base font-sans"
                    placeholder={t("auth.emailPlaceholder")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholderTextColor={colors.secondary}
                    style={{
                      includeFontPadding: false,
                      textAlignVertical: "center",
                    }}
                  />
                  {!field.state.meta.isValid && (
                      <Text className="text-red-500 text-xs font-sans mt-2">
                        {field.state.meta.errors[0]?.message}
                      </Text>
                    )}
                </View>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field name="password">
              {(field) => (
                <View>
                  <Text className="text-primary text-base font-medium font-sans mb-2">
                    {t("auth.password")}
                  </Text>
                  <TextInput
                    id={field.name}
                    className="bg-background border border-border rounded-lg px-4 py-3 text-primary text-base font-sans"
                    placeholder={t("auth.passwordPlaceholder2")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    secureTextEntry
                    autoComplete="password"
                    placeholderTextColor={colors.secondary}
                    style={{
                      includeFontPadding: false,
                      textAlignVertical: "center",
                    }}
                  />
                  {!field.state.meta.isValid && (
                      <Text className="text-red-500 text-xs font-sans mt-2">
                        {field.state.meta.errors[0]?.message}
                      </Text>
                    )}
                </View>
              )}
            </form.Field>
          </View>

          {/* Submit Button */}
          <Pressable
            className={cn(
              "rounded-full py-4 mt-8",
              canSubmit ? "bg-accent" : "bg-gray-300 dark:bg-gray-600"
            )}
            onPress={form.handleSubmit}
            disabled={isSubmitting || !canSubmit}
          >
            <View className="flex-row items-center justify-center">
              {isSubmitting ? (
                <>
                  <ActivityIndicator color={colors.background} size="small" />
                  <Text className="text-background text-center font-semibold text-base font-sans ml-2">
                    {t("auth.signInAction")}...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="log-in" size={20} color={colors.background} />
                  <Text className="text-background text-center font-semibold text-base font-sans ml-2">
                    {t("auth.signIn")}
                  </Text>
                </>
              )}
            </View>
          </Pressable>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6 pt-6 border-t border-border">
            <Text className="text-secondary font-sans">
              {t("auth.dontHaveAccount")}{" "}
            </Text>
            <Pressable onPress={() => router.replace("/auth/sign-up")}>
              <Text className="text-accent font-semibold font-sans">
                {t("auth.signUp")}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Back button */}
        {/* <Pressable className="py-3" onPress={() => router.back()}>
          <View className="flex-row items-center justify-center">
            <Ionicons name="arrow-back" size={20} color={colors.accent} />
            <Text className="text-accent text-center font-medium font-sans ml-2">
              Back to App
            </Text>
          </View>
        </Pressable> */}
      </ScrollView>
    </SafeAreaView>
  );
}
