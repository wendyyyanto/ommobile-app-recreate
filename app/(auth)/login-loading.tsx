import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOADING_SECONDS = 3;

export default function LoginLoadingScreen() {
	const [secondsLeft, setSecondsLeft] = useState(LOADING_SECONDS);

	useEffect(() => {
		if (secondsLeft <= 0) {
			router.replace("/(tabs)");
		}
		const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);

		return () => clearTimeout(timer);
	}, [secondsLeft]);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.black }}
			edges={["top", "bottom"]}
		>
			<View className="flex flex-1 justify-center items-center">
				<LoadingSpinner label="Signing you in ..." />
			</View>
		</SafeAreaView>
	);
}
