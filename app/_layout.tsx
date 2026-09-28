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
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
	OneSignal.Debug.setLogLevel(LogLevel.Verbose);
	OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID as string);
	OneSignal.Notifications.requestPermission(true);
}

export default function RootLayout() {
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

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: "black" }
				}}
			/>
			<Toast />
		</GestureHandlerRootView>
	);
}
