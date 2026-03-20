import BackButton from "@/components/ui/BackButton";
import { TabEnum } from "@/constants/enums";
import TeachingAudioTab from "@/features/teaching/TeachingAudioTab";
import TeachingTab from "@/features/teaching/TeachingTab";
import TeachingVideoTab from "@/features/teaching/TeachingVideoTab";
import { useTeachingStore } from "@/stores/teachingStore";
import { useLocalSearchParams } from "expo-router";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const TeachingDetail = () => {
	const { activeTab } = useTeachingStore();
	const { teachingId } = useLocalSearchParams();

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top", "bottom"]} className="flex-1 px-4">
				<View className="flex gap-8">
					<BackButton />

					<TeachingTab />
				</View>

				<View className="mt-20">
					{activeTab === TabEnum.AUDIO && <TeachingAudioTab />}
					{activeTab === TabEnum.VIDEO && <TeachingVideoTab />}
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default TeachingDetail;
