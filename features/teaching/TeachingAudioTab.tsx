import fonts from "@/constants/fonts";
import { useTeachingStore } from "@/stores/teachingStore";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import TeachingAudioPlayer from "./TeachingAudioPlayer";

const TeachingAudioTab = () => {
	const { teachingDetails, isLoadingTeachingDetails } = useTeachingStore();

	if (isLoadingTeachingDetails) {
		return (
			<View className="justify-center items-center">
				<Text className="text-white text-lg font-semibold">
					Loading...
				</Text>
			</View>
		);
	}

	return (
		<View className="justify-center items-center">
			<Image
				source={teachingDetails?.thumbnailUrl}
				style={{
					width: 200,
					height: 200
				}}
				contentFit="cover"
			/>
			<View className="gap-2">
				<Text
					style={[
						fonts.caption2White,
						{ marginTop: 30, textAlign: "center" }
					]}
				>
					{teachingDetails?.book} {teachingDetails?.chapters}{" "}
					{`: ${teachingDetails?.verses}`}
				</Text>
				<Text
					style={{
						fontSize: 20,
						color: "white",
						fontWeight: 600
					}}
				>
					{teachingDetails?.title}
				</Text>
				<Text style={[fonts.caption2White, { textAlign: "center" }]}>
					{teachingDetails?.teacher ?? "Unknown Teacher"}
				</Text>
			</View>

			<TeachingAudioPlayer audioUrl={teachingDetails?.audioUrl!} />
		</View>
	);
};

export default TeachingAudioTab;
