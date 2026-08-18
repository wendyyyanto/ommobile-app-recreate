import { router, Tabs, usePathname } from "expo-router";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBarIconSize = { width: 18, height: 18, marginBottom: 6 };

export default function TabsLayout() {
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

	return (
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
					tabBarLabel: ({ focused }) => (
						<Text
							numberOfLines={2}
							adjustsFontSizeToFit
							minimumFontScale={0.8}
							style={[
								fonts.caption1White,
								{
									color: focused
										? colors.lightBlue
										: colors.white
								}
							]}
							className="text-center"
						>
							Home
						</Text>
					),
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
					tabBarLabel: ({ focused }) => (
						<Text
							numberOfLines={2}
							adjustsFontSizeToFit
							minimumFontScale={0.8}
							style={[
								fonts.caption1White,
								{
									color: focused
										? colors.lightBlue
										: colors.white
								}
							]}
							className="text-center"
						>
							Teachings
						</Text>
					),
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
					tabBarLabel: ({ focused }) => (
						<Text
							numberOfLines={2}
							adjustsFontSizeToFit
							minimumFontScale={0.8}
							style={[
								fonts.caption1White,
								{
									color: focused
										? colors.lightBlue
										: colors.white
								}
							]}
							className="text-center"
						>
							Notifications
						</Text>
					),
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
	);
}
