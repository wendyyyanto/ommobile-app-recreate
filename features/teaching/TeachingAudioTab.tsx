import fonts from "@/constants/fonts";
import { useTeachingStore } from "@/stores/teachingStore";
import { Image } from "expo-image";
import { Text, View } from "react-native";

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
			<View>
				<Text
					style={[
						fonts.caption2White,
						{ marginTop: 30, textAlign: "center" }
					]}
				>
					{teachingDetails?.book} {teachingDetails?.chapters}{" "}
					{`: ${teachingDetails?.verses}`}
				</Text>
				<Text className="text-white text-3xl font-semibold">
					{teachingDetails?.title}
				</Text>
			</View>
		</View>
	);
};

export default TeachingAudioTab;
