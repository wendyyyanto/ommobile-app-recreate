import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	useFonts
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import "@/styles/global.css";

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

	if (!fontsLoaded && !fontError) {
		return (
			<LinearGradient
				colors={["#0A1628", "#1B3A6B"]}
				style={StyleSheet.absoluteFill}
			>
				<View style={styles.splashLogoContainer}>
					<Image
						source={require("@/assets/images/splash_logo.png")}
						style={styles.splashLogo}
						contentFit="contain"
					/>
				</View>
			</LinearGradient>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
			<Stack screenOptions={{ headerShown: false }} />
			<Toast />
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	splashLogoContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	splashLogo: {
		width: 200,
		height: 200
	}
});
