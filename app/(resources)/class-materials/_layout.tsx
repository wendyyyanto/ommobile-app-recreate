import { Stack } from "expo-router";

const ClassMaterialsLayout = () => {
	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				headerShown: false
			}}
		/>
	);
};

export default ClassMaterialsLayout;
