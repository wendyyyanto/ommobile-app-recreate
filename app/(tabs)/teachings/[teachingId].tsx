import BackButton from "@/components/ui/BackButton";
import colors from "@/constants/colors";
import { TabEnum } from "@/constants/enums";
import fonts from "@/constants/fonts";
import TeachingAudioTab from "@/features/teaching/TeachingAudioTab";
import TeachingTab from "@/features/teaching/TeachingTab";
import TeachingVideoTab from "@/features/teaching/TeachingVideoTab";
import { useTeachingStore } from "@/stores/teachingStore";
import { handleDownloadFile } from "@/utils/fileHelper";
import { Image } from "expo-image";
import {
	ImageBackground,
	Pressable,
	StyleSheet,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const backgroundImage = require("@/assets/images/background.png");

const TeachingDetail = () => {
	const { activeTab, teachingDetails } = useTeachingStore();

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
					<Pressable
						style={styles.downloadButton}
						onPress={() => {
							if (
								(teachingDetails?.pdfUrl !== "" &&
									teachingDetails?.pdfUrl !== null) ||
								(teachingDetails?.pptUrl !== "" &&
									teachingDetails?.pptUrl !== null)
							) {
								Toast.show({
									type: "info",
									text1: "Downloading file...",
									text2: "Please wait while we download the file...",
									visibilityTime: 6000
								});
								handleDownloadFile(
									teachingDetails?.pdfUrl ||
										teachingDetails?.pptUrl!
								);
							} else {
								Toast.show({
									type: "error",
									text1: "No file to download",
									text2: "The audio of this teaching is not available, please contact our support team.",
									visibilityTime: 6000
								});
							}
						}}
					>
						<Image
							source={require("@/assets/icons/download.svg")}
							style={{ width: 16, height: 16 }}
						/>
						<Text style={fonts.caption2White}>Download File</Text>
					</Pressable>
					<Pressable
						style={styles.downloadButton}
						onPress={() => {
							if (
								teachingDetails?.audioUrl !== "" ||
								teachingDetails?.videoUrl !== null
							) {
								Toast.show({
									type: "info",
									text1: "Downloading file...",
									text2: "It might take a few minutes to finish the download, please wait...",
									visibilityTime: 6000
								});
								handleDownloadFile(teachingDetails?.audioUrl!);
							} else {
								Toast.show({
									type: "error",
									text1: "No file to download",
									text2: "The audio of this teaching is not available, please contact our support team.",
									visibilityTime: 6000
								});
							}
						}}
					>
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
