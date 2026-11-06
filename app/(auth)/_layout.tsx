import { Stack } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";

const AuthLayout = () => {
	const reduced = useReducedMotion();

	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				animation: reduced ? "fade" : "default",
				headerShown: false
			}}
		>
			<Stack.Screen
				name="login"
				options={{ animationTypeForReplace: "pop" }}
			/>
		</Stack>
	);
};

export default AuthLayout;
