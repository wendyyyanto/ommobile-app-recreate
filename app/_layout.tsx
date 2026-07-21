import "@/styles/global.css";
import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	useFonts
} from "@expo-google-fonts/poppins";
import { SplashScreen, Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

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
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
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
