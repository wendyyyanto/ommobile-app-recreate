import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	useFonts
} from "@expo-google-fonts/poppins";
import { router, SplashScreen, Tabs, usePathname } from "expo-router";
import { TamaguiProvider } from "tamagui";

import fonts from "@/constants/fonts";
import "@/styles/global.css";
import config from "@/tamagui.config";
import { Image } from "expo-image";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const tabBarIconSize = { width: 18, height: 18, marginBottom: 6 };

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold
	});
	const insets = useSafeAreaInsets();
	const pathname = usePathname();
	const tabBarRootRoutes = ["/", "/teachings", "/notifications"];
	const shouldHideTabBar = !tabBarRootRoutes.includes(pathname);
	const baseTabBarStyle = {
		backgroundColor: "black",
		paddingBottom: 12 + insets.bottom,
		paddingTop: 10,
		height: 58 + 10 + (12 + insets.bottom),
		borderColor: "transparent"
	};

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TamaguiProvider config={config} defaultTheme="light">
				<Tabs
					screenOptions={{
						headerTransparent: true,
						headerShadowVisible: false,
						headerTitleStyle: {
							color: "white"
						},
						headerTintColor: "white",
						sceneStyle: {
							backgroundColor: "black"
						},
						tabBarStyle: shouldHideTabBar
							? [{ ...baseTabBarStyle }, { display: "none" }]
							: baseTabBarStyle,
						tabBarLabelStyle: {
							...fonts.caption1White
						}
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							title: "Home",
							tabBarIcon: ({ focused }) =>
								focused ? (
									<Image
										source={require("@/assets/icons/home_active.svg")}
										style={tabBarIconSize}
									/>
								) : (
									<Image
										source={require("@/assets/icons/home_inactive.svg")}
										style={tabBarIconSize}
									/>
								),
							headerShown: false
						}}
					/>
					<Tabs.Screen
						name="teachings"
						listeners={{
							tabPress: (e) => {
								e.preventDefault();
								router.replace("/teachings");
							}
						}}
						options={{
							title: "Teachings",
							tabBarIcon: ({ focused }) =>
								focused ? (
									<Image
										source={require("@/assets/icons/teaching_active.svg")}
										style={tabBarIconSize}
									/>
								) : (
									<Image
										source={require("@/assets/icons/teaching_inactive.svg")}
										style={tabBarIconSize}
									/>
								),
							headerShown: false
						}}
					/>
					<Tabs.Screen
						name="notifications"
						listeners={{
							tabPress: (e) => {
								e.preventDefault();
								router.replace("/notifications");
							}
						}}
						options={{
							title: "Notifications",
							tabBarIcon: ({ focused }) =>
								focused ? (
									<Image
										source={require("@/assets/icons/notif_active.svg")}
										style={tabBarIconSize}
									/>
								) : (
									<Image
										source={require("@/assets/icons/notif_inactive.svg")}
										style={tabBarIconSize}
									/>
								),
							headerShown: false
						}}
					/>
				</Tabs>
			</TamaguiProvider>
		</GestureHandlerRootView>
	);
}
