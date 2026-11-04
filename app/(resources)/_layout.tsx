import { Stack } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";

const ResourcesLayout = () => {
	const reduced = useReducedMotion();

	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				animation: reduced ? "fade" : "default",
				headerShown: false
			}}
		/>
	);
};

export default ResourcesLayout;
