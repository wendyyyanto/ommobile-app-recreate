import { Stack } from "expo-router";

const NotificationsLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: "black"
				}
			}}
		/>
	);
};

export default NotificationsLayout;
