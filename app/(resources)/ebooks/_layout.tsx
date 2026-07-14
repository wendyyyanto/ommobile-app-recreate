import { Stack } from "expo-router";

const EBooksResourcesLayout = () => {
	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: "black" },
				headerShown: false
			}}
		/>
	);
};

export default EBooksResourcesLayout;
