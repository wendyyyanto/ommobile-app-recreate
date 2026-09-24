import { router, Tabs, usePathname, useSegments } from "expo-router";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Text } from "react-native";
import {
	LogLevel,
	OneSignal,
	type NotificationClickEvent
} from "react-native-onesignal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBarIconSize = { width: 18, height: 18, marginBottom: 6 };

export default function TabsLayout() {
	const insets = useSafeAreaInsets();
	const pathname = usePathname();
	const segments = useSegments();
	const shouldHideTabBar = segments.length > 2;
	const baseTabBarStyle = {
		backgroundColor: "black",
		paddingBottom: 12 + insets.bottom,
		paddingTop: 10,
		height: 58 + 10 + (12 + insets.bottom),
		borderColor: "transparent"
	};

	useEffect(() => {
		OneSignal.Debug.setLogLevel(LogLevel.Verbose);
		OneSignal.initialize(
			process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID as string
		);
		OneSignal.Notifications.requestPermission(true);
	}, []);

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
					? { display: "none" }
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
						if (pathname === "/teachings") return;

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
						if (pathname === "/notifications") return;

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
