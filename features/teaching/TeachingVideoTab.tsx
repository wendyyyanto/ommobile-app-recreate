import fonts from "@/constants/fonts";
import { QUICK_FADE } from "@/constants/motion";
import { TeachingVideoSkeleton } from "@/features/skeletons/ContentSkeletons";
import { useTeachingStore } from "@/stores/teachingStore";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import YoutubePlayer from "react-native-youtube-iframe";

const getYoutubeId = (url?: string | null) =>
	url?.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];

const TeachingVideoTab = () => {
	const teachingDetails = useTeachingStore((s) => s.teachingDetails);
	const isLoadingTeachingDetails = useTeachingStore(
		(s) => s.isLoadingTeachingDetails
	);
	const youtubeId = getYoutubeId(teachingDetails?.video_url);

	if (isLoadingTeachingDetails) {
		return <TeachingVideoSkeleton />;
	}

	if (!youtubeId) {
		return (
			<Animated.View entering={QUICK_FADE}>
				<View className="w-full min-h-48 justify-center items-center">
					<Text style={fonts.body1White}>This teaching has no video</Text>
				</View>
			</Animated.View>
		);
	}

	return (
		<Animated.View entering={QUICK_FADE}>
		<View className="w-full rounded-2xl overflow-hidden">
			<YoutubePlayer
				height={200}
				videoId={youtubeId}
				contentScale={0.8}
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
				<Text style={[fonts.caption2White, { textAlign: "center" }]}>
					{teachingDetails?.teacher ?? "Unknown Teacher"}
				</Text>
			</View>
		</View>
		</Animated.View>
	);
};

export default TeachingVideoTab;
