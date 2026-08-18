import { Stack } from "expo-router";

const TeachingsLayout = () => {
	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
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
