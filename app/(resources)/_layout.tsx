import { Stack } from "expo-router";

const ResourcesLayout = () => {
	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				headerShown: false
			}}
		/>
	);
};

export default ResourcesLayout;
