import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	useFonts
} from "@expo-google-fonts/poppins";
import { SplashScreen, Stack } from "expo-router";

import { useEffect } from "react";
import "../styles/global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold
	});

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return (
		<Stack
			screenOptions={{
				headerTransparent: true,
				headerShadowVisible: false,
				headerTitleStyle: {
					color: "white"
				},
				headerTintColor: "white",
				contentStyle: {
					backgroundColor: "black"
				}
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="teachings" options={{ headerShown: false }} />
		</Stack>
	);
}
