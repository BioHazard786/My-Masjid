import { useAuth } from "@mobile/hooks/use-auth";
import { Stack } from "expo-router";

export default function AuthLayout() {
	const { isAuthenticated } = useAuth();

	return (
		<Stack>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen
					name="sign-in"
					options={{
						headerShown: false,
						title: "Sign In",
					}}
				/>
				<Stack.Screen
					name="sign-up"
					options={{
						headerShown: false,
						title: "Sign Up",
					}}
				/>
			</Stack.Protected>
		</Stack>
	);
}
