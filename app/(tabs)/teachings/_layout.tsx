import { Stack } from "expo-router";

const TeachingsLayout = () => {
	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				headerShown: false
			}}
		></Stack>
	);
};

export default TeachingsLayout;
