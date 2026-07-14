import { TabEnum } from "@/constants/enums";
import fonts from "@/constants/fonts";
import { useTeachingStore } from "@/stores/teachingStore";
import { Text, View } from "react-native";
import {
	Directions,
	Gesture,
	GestureDetector
} from "react-native-gesture-handler";
import YoutubePlayer from "react-native-youtube-iframe";
import TeachingMetadata from "./TeachingMetadata";

const TeachingVideoTab = () => {
	const { teachingDetails, setActiveTab } = useTeachingStore();

	if (!teachingDetails?.youtubeId || teachingDetails?.youtubeId === "") {
		return (
			<View className="justify-center items-center">
				<Text style={fonts.body1White}>This teaching has no video</Text>
			</View>
		);
	}

	const flingGestureHandler = Gesture.Fling()
		.direction(Directions.RIGHT)
		.onStart(() => {
			setActiveTab(TabEnum.AUDIO);
		})
		.runOnJS(true);

	return (
		<GestureDetector gesture={flingGestureHandler}>
			<View className="rounded-2xl overflow-hidden">
				<YoutubePlayer
					height={200}
					videoId={teachingDetails?.youtubeId}
					contentScale={0.8}
				/>

				<TeachingMetadata teachingDetails={teachingDetails} />
			</View>
		</GestureDetector>
	);
};

export default TeachingVideoTab;
