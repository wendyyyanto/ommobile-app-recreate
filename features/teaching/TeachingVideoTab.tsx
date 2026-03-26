import fonts from "@/constants/fonts";
import { useTeachingStore } from "@/stores/teachingStore";
import { Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const TeachingVideoTab = () => {
	const { teachingDetails } = useTeachingStore();

	if (!teachingDetails?.youtubeId || teachingDetails?.youtubeId === "") {
		return (
			<View className="justify-center items-center">
				<Text style={fonts.body1White}>This teaching has no video</Text>
			</View>
		);
	}

	return (
		<View className="rounded-2xl overflow-hidden">
			<YoutubePlayer
				height={200}
				videoId={teachingDetails?.youtubeId}
				contentScale={0.8}
			/>
		</View>
	);
};

export default TeachingVideoTab;
