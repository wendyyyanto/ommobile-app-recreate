import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import { useAuthStore } from "@/stores/authStore";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Magic link target: https://mobile.organic-ministry.org/auth?token=... (or ommobileapp://auth?token=...)
export default function LoginLoadingScreen() {
	const { token } = useLocalSearchParams<{ token?: string }>();
	const login = useAuthStore((s) => s.login);

	useEffect(() => {
		// ponytail: token is only validated when the home screen fetches /profile (401 -> logout); route to /expired-link if that UX is wanted
		// auth routes become guarded after login; the router falls back to index, which redirects to tabs
		if (token) login(token);
	}, [token, login]);

	if (!token) return <Redirect href="/login" />;

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.black }}
			edges={["top", "bottom"]}
		>
			<View className="flex flex-1 justify-center items-center">
				<LoadingSpinner label="Signing you in ..." />
			</View>
		</SafeAreaView>
	);
}
