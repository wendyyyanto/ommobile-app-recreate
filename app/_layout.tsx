import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	useFonts
} from "@expo-google-fonts/poppins";
import { router, SplashScreen, Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";

import "@/styles/global.css";
import config from "@/tamagui.config";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	LogLevel,
	OneSignal,
	type NotificationClickEvent
} from "react-native-onesignal";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold
	});

	useEffect(() => {
		OneSignal.Debug.setLogLevel(LogLevel.Verbose);
		OneSignal.initialize(
			process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID as string
		);
		OneSignal.Notifications.requestPermission(true);
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	useEffect(() => {
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

		OneSignal.Notifications.addEventListener(
			"click",
			handleNotificationClick
		);

		return () => {
			OneSignal.Notifications.removeEventListener(
				"click",
				handleNotificationClick
			);
		};
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TamaguiProvider config={config} defaultTheme="light">
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: { backgroundColor: "black" }
					}}
				>
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="teachings/[teachingId]" />
					<Stack.Screen name="notifications/[notificationId]" />
					<Stack.Screen name="+not-found" />
				</Stack>
			</TamaguiProvider>
			<Toast />
		</GestureHandlerRootView>
	);
}
