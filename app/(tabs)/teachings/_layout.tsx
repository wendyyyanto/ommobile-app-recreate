import { Stack } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";

const TeachingsLayout = () => {
	const reduced = useReducedMotion();

	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				animation: reduced ? "fade" : "default",
				headerShown: false
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="section/[sectionId]" />
			<Stack.Screen name="search" />
		</Stack>
	);
};

export default TeachingsLayout;
