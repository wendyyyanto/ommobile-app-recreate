import { Stack } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";

const NotificationsLayout = () => {
	const reduced = useReducedMotion();

	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
				animation: reduced ? "fade" : "default",
				headerShown: false,
				contentStyle: {
					backgroundColor: "black"
				}
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="[notificationId]" />
		</Stack>
	);
};

export default NotificationsLayout;
