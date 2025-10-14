import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "@mobile/hooks/use-i18n";
import { useCreateMasjid } from "@mobile/hooks/use-masjid";
import { useThemeColors } from "@mobile/hooks/use-theme-color";
import { authClient } from "@mobile/lib/auth-client";
import { cn } from "@packages/utils";
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

export default function SignUpScreen() {
	const colors = useThemeColors();
	const createMasjidMutation = useCreateMasjid();
	const { t } = useI18n();

	const signUpSchema = z.object({
		name: z.string().min(2, t("auth.nameMinLength")),
		email: z.email(t("auth.invalidEmail")),
		password: z.string().min(5, t("auth.passwordMinLength")),
		area: z.string().min(2, t("auth.areaMinLength")),
		city: z.string().min(2, t("auth.cityMinLength")),
		country: z.string().min(2, t("auth.countryMinLength")),
	});

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			area: "",
			city: "",
			country: "",
		},
		onSubmit: async ({ value: formValue }) => {
			const trimmedValue = Object.fromEntries(
				Object.entries(formValue).map(([key, value]) => [
					key,
					typeof value === "string" ? value.trim() : value,
				]),
			);

			const parsedValue = signUpSchema.safeParse(trimmedValue);

			if (!parsedValue.success) {
				console.log("Validation errors:", parsedValue.error);
				ToastAndroid.show(t("auth.fixFormErrors"), ToastAndroid.SHORT);
				return;
			}

			const value = parsedValue.data;

			const { error } = await authClient.signUp.email({
				name: value.name,
				email: value.email,
				password: value.password,
			});

			if (error) {
				console.log(error);
				ToastAndroid.show(
					error?.message || t("auth.signUpError"),
					ToastAndroid.SHORT,
				);
				form.reset();
				return;
			}

			try {
				await createMasjidMutation.mutateAsync({
					name: value.name,
					address: `${value.area}, ${value.city}, ${value.country}`,
				});

				router.dismissAll();
			} catch (error) {
				console.error("Error creating masjid:", error);
				ToastAndroid.show(t("auth.createMasjidError"), ToastAndroid.SHORT);
			}
		},
		validators: {
			onChange: signUpSchema,
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
							<Ionicons name="person-add" size={32} color={colors.accent} />
						</View>
						<Text
							className="text-3xl font-bold text-primary mb-2 font-sans text-center"
							style={{ lineHeight: 40 }}
						>
							{t("auth.createMasjidAccount")}
						</Text>
						<Text className="text-secondary text-base font-sans text-center max-w-sm">
							{t("auth.signUpSubtitle")}
						</Text>
					</View>

					{/* Form */}
					<View className="flex gap-7">
						{/* Name Field */}
						<form.Field name="name">
							{(field) => (
								<View>
									<Text className="text-primary text-base font-medium font-sans mb-2">
										{t("auth.name")}
									</Text>
									<TextInput
										id={field.name}
										className="bg-background border border-border rounded-lg px-4 py-3 text-primary text-base font-sans"
										placeholder={t("auth.namePlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										autoComplete="name"
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

						{/* Email Field */}
						<form.Field name="email">
							{(field) => (
								<View>
									<Text className="text-primary text-base font-medium font-sans mb-2">
										{t("auth.emailAddress")}
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
										placeholder={t("auth.passwordPlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										secureTextEntry
										autoComplete="new-password"
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

						{/* Area Field */}
						<form.Field name="area">
							{(field) => (
								<View>
									<Text className="text-primary text-base font-medium font-sans mb-2">
										{t("auth.area")}
									</Text>
									<TextInput
										id={field.name}
										className="bg-background border border-border rounded-lg px-4 py-3 text-primary text-base font-sans"
										placeholder={t("auth.areaPlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										autoComplete="street-address"
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

						{/* City Field */}
						<form.Field name="city">
							{(field) => (
								<View>
									<Text className="text-primary text-base font-medium font-sans mb-2">
										{t("auth.city")}
									</Text>
									<TextInput
										id={field.name}
										className="bg-background border border-border rounded-lg px-4 py-3 text-primary text-base font-sans"
										placeholder={t("auth.cityPlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										autoComplete="address-line1"
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

						{/* Country Field */}
						<form.Field name="country">
							{(field) => (
								<View>
									<Text className="text-primary text-base font-medium font-sans mb-2">
										{t("auth.country")}
									</Text>
									<TextInput
										id={field.name}
										className="bg-background border border-border rounded-lg px-4 py-3 text-primary text-base font-sans"
										placeholder={t("auth.countryPlaceholder")}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										autoComplete="country"
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
							canSubmit ? "bg-accent" : "bg-gray-300 dark:bg-gray-600",
						)}
						onPress={form.handleSubmit}
						disabled={isSubmitting || !canSubmit}
					>
						<View className="flex-row items-center justify-center">
							{isSubmitting ? (
								<>
									<ActivityIndicator color={colors.background} size="small" />
									<Text className="text-background text-center font-semibold text-base font-sans ml-2">
										{t("auth.creatingAccount")}
									</Text>
								</>
							) : (
								<>
									<Ionicons
										name="person-add"
										size={20}
										color={colors.background}
									/>
									<Text className="text-background text-center font-semibold text-base font-sans ml-2">
										{t("auth.signUpAction")}
									</Text>
								</>
							)}
						</View>
					</Pressable>

					{/* Sign In Link */}
					<View className="flex-row justify-center mt-6 pt-6 border-t border-border">
						<Text className="text-secondary font-sans">
							{t("auth.alreadyHaveAccount")}
						</Text>
						<Pressable onPress={() => router.replace("/auth/sign-in")}>
							<Text className="text-accent font-semibold font-sans">
								{t("auth.signIn")}
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
