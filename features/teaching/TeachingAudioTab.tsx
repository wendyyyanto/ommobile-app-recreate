import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { TabEnum } from "@/constants/enums";
import { useTeachingStore } from "@/stores/teachingStore";
import { Image } from "expo-image";
import { View } from "react-native";
import {
	Directions,
	Gesture,
	GestureDetector
} from "react-native-gesture-handler";
import TeachingAudioPlayer from "./TeachingAudioPlayer";
import TeachingMetadata from "./TeachingMetadata";

const TeachingAudioTab = () => {
	const { teachingDetails, isLoadingTeachingDetails, setActiveTab } =
		useTeachingStore();

	const flingGestureHandler = Gesture.Fling()
		.direction(Directions.LEFT)
		.onStart(() => {
			setActiveTab(TabEnum.VIDEO);
		})
		.runOnJS(true);

	if (isLoadingTeachingDetails) {
		return <LoadingSpinner />;
	}

	return (
		<GestureDetector gesture={flingGestureHandler}>
			<View className="justify-center items-center">
				<Image
					source={teachingDetails?.thumbnailUrl}
					style={{
						width: 200,
						height: 200
					}}
					contentFit="cover"
				/>
				<TeachingMetadata teachingDetails={teachingDetails} />

				<TeachingAudioPlayer />
			</View>
		</GestureDetector>
	);
};

export default TeachingAudioTab;
