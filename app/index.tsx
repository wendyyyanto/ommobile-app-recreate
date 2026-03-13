import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-2xl font-bold">Hello World</Text>
			<Link href="/detail" className="text-blue-500">
				Detail
			</Link>
		</View>
	);
}
