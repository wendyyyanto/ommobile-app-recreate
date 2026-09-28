import { Stack } from "expo-router";

const NotificationsLayout = () => {
	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
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
