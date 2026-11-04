import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import { getProfile } from "@/services/authServices";
import { useAuthStore } from "@/stores/authStore";
import { showErrorToast } from "@/utils/toastHelper";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Magic link target: https://mobile.organic-ministry.org/auth?token=... (or ommobileapp://auth?token=...)
export default function LoginLoadingScreen() {
	const { token } = useLocalSearchParams<{ token?: string }>();
	const login = useAuthStore((s) => s.login);
	const setProfile = useAuthStore((s) => s.setProfile);

	useEffect(() => {
		if (!token) return;
		let active = true;

		void getProfile(token, {
			onSuccess: (profile) => {
				if (!active) return;
				setProfile(profile);
				// auth routes become guarded after login; the router falls back to index, which redirects to tabs
				login(token);
			},
			onError: (error) => {
				if (!active) return;
				if (error?.response?.status === 401) {
					router.replace("/expired-link");
					return;
				}
				showErrorToast(
					"Couldn't sign you in",
					"Check your connection and tap the link in your email again"
				);
				router.replace("/login");
			}
		});

		return () => {
			active = false;
		};
	}, [token, login, setProfile]);

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
