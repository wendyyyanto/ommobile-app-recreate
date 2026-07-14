import { Stack } from "expo-router";

const AuthLayout = () => {
	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				headerShown: false
			}}
		/>
	);
};

export default AuthLayout;
