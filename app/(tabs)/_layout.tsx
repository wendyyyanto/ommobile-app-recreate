import { router, Tabs, usePathname, useSegments } from "expo-router";

import FloatingTabBar from "@/components/ui/FloatingTabBar";

export default function TabsLayout() {
	const pathname = usePathname();
	const segments = useSegments();
	const shouldHideTabBar = segments.length > 2;

	return (
		<Tabs
			tabBar={(props) =>
				shouldHideTabBar ? null : <FloatingTabBar {...props} />
			}
			screenOptions={{
				headerTransparent: true,
				headerShadowVisible: false,
				headerTitleStyle: {
					color: "white"
				},
				headerTintColor: "white",
				sceneStyle: {
					backgroundColor: "transparent"
				}
			}}
		>
			<Tabs.Screen
				name="index"
				options={{ title: "Home", headerShown: false }}
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
				options={{ title: "Teachings", headerShown: false }}
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
				options={{ title: "Notifications", headerShown: false }}
			/>
		</Tabs>
	);
}
