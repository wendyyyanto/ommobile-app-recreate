import BackButton from "@/components/ui/BackButton";
import { useState } from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabLayout } from "tamagui";

const backgroundImage = require("@/assets/images/background.png");

const TeachingDetail = () => {
	const [tabState, setTabState] = useState<{
		currentTab: string;
		/**
		 * Layout of the Tab user might intend to select (hovering / focusing)
		 */
		intentAt: TabLayout | null;
		/**
		 * Layout of the Tab user selected
		 */
		activeAt: TabLayout | null;
		/**
		 * Used to get the direction of activation for animating the active indicator
		 */
		prevActiveAt: TabLayout | null;
	}>({
		activeAt: null,
		currentTab: "tab1",
		intentAt: null,
		prevActiveAt: null
	});

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top", "bottom"]} className="flex-1 px-4">
				<View className="flex flex-row justify-between items-start">
					<BackButton />
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default TeachingDetail;
