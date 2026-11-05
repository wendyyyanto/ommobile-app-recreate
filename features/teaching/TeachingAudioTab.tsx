import { TabEnum } from "@/constants/enums";
import fonts from "@/constants/fonts";
import { QUICK_FADE } from "@/constants/motion";
import { TeachingAudioSkeleton } from "@/features/skeletons/ContentSkeletons";
import { useTeachingStore } from "@/stores/teachingStore";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import {
	Directions,
	Gesture,
	GestureDetector
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import TeachingAudioPlayer from "./TeachingAudioPlayer";
import { useShallow } from "zustand/react/shallow";

const TeachingAudioTab = () => {
	const {
		teachingDetails,
		isLoadingTeachingDetails,
		setActiveTab
	} = useTeachingStore(
		useShallow((s) => ({
			teachingDetails: s.teachingDetails,
			isLoadingTeachingDetails: s.isLoadingTeachingDetails,
			setActiveTab: s.setActiveTab
		}))
	);

	const flingGestureHandler = Gesture.Fling()
		.direction(Directions.LEFT)
		.onStart(() => {
			void Haptics.selectionAsync();
			setActiveTab(TabEnum.VIDEO);
		})
		.runOnJS(true);

	if (isLoadingTeachingDetails) {
		return <TeachingAudioSkeleton />;
	}

	return (
		<GestureDetector gesture={flingGestureHandler}>
			<Animated.View
				entering={QUICK_FADE}
				style={{ justifyContent: "center", alignItems: "center" }}
			>
				<Image
					source={teachingDetails?.thumbnail_url}
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
						{teachingDetails?.passage}
					</Text>
					<Text
						style={{
							fontSize: 20,
							color: "white",
							fontWeight: 600,
							textAlign: "center"
						}}
					>
						{teachingDetails?.title}
					</Text>
					<Text
						style={[fonts.caption2White, { textAlign: "center" }]}
					>
						{teachingDetails?.teacher ?? "Unknown Teacher"}
					</Text>
				</View>

				{teachingDetails?.audio_file?.url?.trim() ? (
					<TeachingAudioPlayer />
				) : (
					<Text style={[fonts.body1White, { marginTop: 28 }]}>
						This teaching has no audio
					</Text>
				)}
			</Animated.View>
		</GestureDetector>
	);
};

export default TeachingAudioTab;
