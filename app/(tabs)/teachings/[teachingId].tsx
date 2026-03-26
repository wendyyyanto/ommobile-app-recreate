import BackButton from "@/components/ui/BackButton";
import colors from "@/constants/colors";
import { TabEnum } from "@/constants/enums";
import fonts from "@/constants/fonts";
import TeachingAudioTab from "@/features/teaching/TeachingAudioTab";
import TeachingTab from "@/features/teaching/TeachingTab";
import TeachingVideoTab from "@/features/teaching/TeachingVideoTab";
import { useTeachingStore } from "@/stores/teachingStore";
import { Image } from "expo-image";
import {
	ImageBackground,
	Pressable,
	StyleSheet,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const TeachingDetail = () => {
	const { activeTab } = useTeachingStore();

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

				<View className="flex-row justify-between items-center mt-20 gap-4">
					<Pressable style={styles.downloadButton}>
						<Image
							source={require("@/assets/icons/download.svg")}
							style={{ width: 16, height: 16 }}
						/>
						<Text style={fonts.caption2White}>Download File</Text>
					</Pressable>
					<Pressable style={styles.downloadButton}>
						<Image
							source={require("@/assets/icons/audio.svg")}
							style={{ width: 16, height: 16 }}
						/>
						<Text style={fonts.caption2White}>Download Audio</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	downloadButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 16,
		borderWidth: 1,
		borderColor: colors.slateGrayBlue,
		borderRadius: 40,
		paddingHorizontal: 24,
		paddingVertical: 16
	}
});

export default TeachingDetail;
