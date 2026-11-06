import PressableScale from "@/components/ui/PressableScale";
import colors from "@/constants/colors";
import { CONTENT_FADE, OPACITY_TRANSITION } from "@/constants/motion";
import { TeachingAudioPlayerSkeleton } from "@/features/skeletons/ContentSkeletons";
import useTeachingAudioPlayer from "@/hooks/useTeachingAudioPlayer";
import { formatDuration } from "@/utils/timeHelper";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

const playPauseIconStyle = { width: 68, height: 68 };
const seekIconStyle = { width: 36, height: 36 };
const ICON_SWAP_TRANSITION = {
	...OPACITY_TRANSITION,
	transitionDuration: "120ms"
};
const ICON_PRESS_SCALE = 0.95;

const withHaptic = (action: () => void) => () => {
	void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	action();
};

const TeachingAudioPlayer = () => {
	const {
		playbackRate,
		status,
		currentTime,
		duration,
		handleSeekTo,
		handlePlayPause,
		handleSlideMove,
		handleChangePlaybackRate
	} = useTeachingAudioPlayer();

	if (!status.isLoaded && !status.duration)
		return <TeachingAudioPlayerSkeleton />;

	return (
		<Animated.View entering={CONTENT_FADE} style={{ width: "100%" }}>
			<Slider
				style={{
					width: "95%",
					alignSelf: "center",
					marginTop: 28,
					marginBottom: 14
				}}
				value={currentTime ?? 0}
				minimumValue={0}
				maximumValue={status.duration ?? 0}
				step={1}
				minimumTrackTintColor={colors.steelBlue}
				maximumTrackTintColor={colors.lightGray}
				thumbTintColor={colors.lightBlue}
				onSlidingComplete={(value) => handleSeekTo(value)}
				onValueChange={(value) => handleSlideMove(value)}
			/>
			<View className="flex-row justify-between">
				<Text className="text-white">
					{formatDuration(currentTime)}
				</Text>
				<Text className="text-white">{formatDuration(duration)}</Text>
			</View>

			<View className="flex-row justify-between items-center mt-5">
				<View className="w-11 h-11" />

				<View className="flex-row justify-center items-center gap-8">
					<PressableScale
						scaleTo={ICON_PRESS_SCALE}
						accessibilityRole="button"
						accessibilityLabel="Rewind 15 seconds"
						onPress={withHaptic(() => handleSeekTo(currentTime - 15))}
					>
						<Image
							source={require("@/assets/icons/backward_15s.svg")}
							style={seekIconStyle}
						/>
					</PressableScale>
					<PressableScale
						scaleTo={ICON_PRESS_SCALE}
						accessibilityRole="button"
						accessibilityLabel={status.playing ? "Pause" : "Play"}
						onPress={withHaptic(handlePlayPause)}
					>
						<View style={playPauseIconStyle}>
							<Animated.View
								style={[
									StyleSheet.absoluteFill,
									ICON_SWAP_TRANSITION,
									{ opacity: status.playing ? 0 : 1 }
								]}
							>
								<Image
									source={require("@/assets/icons/play.svg")}
									style={playPauseIconStyle}
								/>
							</Animated.View>
							<Animated.View
								style={[
									StyleSheet.absoluteFill,
									ICON_SWAP_TRANSITION,
									{ opacity: status.playing ? 1 : 0 }
								]}
							>
								<Image
									source={require("@/assets/icons/pause.svg")}
									style={playPauseIconStyle}
								/>
							</Animated.View>
						</View>
					</PressableScale>
					<PressableScale
						scaleTo={ICON_PRESS_SCALE}
						accessibilityRole="button"
						accessibilityLabel="Forward 30 seconds"
						onPress={withHaptic(() => handleSeekTo(currentTime + 30))}
					>
						<Image
							source={require("@/assets/icons/forward_30s.svg")}
							style={seekIconStyle}
						/>
					</PressableScale>
				</View>

				<PressableScale
					style={{
						width: 48,
						height: 48,
						backgroundColor: colors.slateGray,
						borderRadius: 8,
						alignItems: "center",
						justifyContent: "center"
					}}
					accessibilityRole="button"
					accessibilityLabel={`Playback speed ${playbackRate}x`}
					onPress={withHaptic(handleChangePlaybackRate)}
				>
					<Text className="text-white ">{playbackRate}x</Text>
				</PressableScale>
			</View>
		</Animated.View>
	);
};

export default TeachingAudioPlayer;
