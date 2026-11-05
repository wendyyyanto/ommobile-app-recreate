import "@/styles/global.css";
import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	useFonts
} from "@expo-google-fonts/poppins";
import Constants from "expo-constants";
import { router, SplashScreen, Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { enableUnsetNotificationCategories } from "@/hooks/useNotificationSettings";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReducedMotion } from "react-native-reanimated";
import {
	LogLevel,
	OneSignal,
	type NotificationClickEvent
} from "react-native-onesignal";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

const isExpoGo = Constants.executionEnvironment === "storeClient";

// Initialize at module load: child screen effects (e.g. notification settings
// calling OneSignal.User.getTags) run before this layout's effects would.
if (!isExpoGo) {
	OneSignal.Debug.setLogLevel(__DEV__ ? LogLevel.Verbose : LogLevel.None);
	OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID as string);
}

export default function RootLayout() {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
	const reduced = useReducedMotion();
	const [fontsLoaded, fontError] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	useEffect(() => {
		// app-wide default; screens that support landscape (e.g. PdfViewer) unlock themselves
		ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.PORTRAIT_UP
		);
	}, []);

	useEffect(() => {
		if (!isLoggedIn || isExpoGo) return;
		OneSignal.Notifications.requestPermission(false);
		void enableUnsetNotificationCategories();
	}, [isLoggedIn]);

	useEffect(() => {
		if (isExpoGo) return;

		const handleNotificationClick = (event: NotificationClickEvent) => {
			const data = event.notification.additionalData as
				| { notificationId?: number | string; teachingId?: string }
				| undefined;

			if (data?.notificationId) {
				router.push(`/notifications/${data.notificationId}`);
			} else if (data?.teachingId) {
				router.push(`/teachings/${data.teachingId}`);
			}
		};

		OneSignal.Notifications.addEventListener("click", handleNotificationClick);

		return () => {
			OneSignal.Notifications.removeEventListener(
				"click",
				handleNotificationClick
			);
		};
	}, []);

	// Text measured with the fallback font gets clipped on Android once Poppins swaps in
	if (!fontsLoaded && !fontError) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: "black" },
					animation: reduced ? "fade" : "default"
				}}
			>
				<Stack.Protected guard={isLoggedIn}>
					<Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
					<Stack.Screen name="(resources)" />
					<Stack.Screen name="notifications/[notificationId]" />
					<Stack.Screen name="teaching/[teachingId]" />
					<Stack.Screen name="teachings/[teachingId]" />
					<Stack.Screen name="settings" />
				</Stack.Protected>
				<Stack.Protected guard={!isLoggedIn}>
					<Stack.Screen name="(auth)" options={{ animation: "fade" }} />
				</Stack.Protected>
			</Stack>
			<Toast />
		</GestureHandlerRootView>
	);
}
