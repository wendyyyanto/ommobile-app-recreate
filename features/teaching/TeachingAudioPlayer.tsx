import colors from "@/constants/colors";
import { TeachingAudioPlayerSkeleton } from "@/features/skeletons/ContentSkeletons";
import useTeachingAudioPlayer from "@/hooks/useTeachingAudioPlayer";
import { formatDuration } from "@/utils/timeHelper";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

const playPauseIconStyle = { width: 68, height: 68 };
const seekIconStyle = { width: 36, height: 36 };

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
		<View className="w-full">
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
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Rewind 15 seconds"
						onPress={withHaptic(() => handleSeekTo(currentTime - 15))}
					>
						<Image
							source={require("@/assets/icons/backward_15s.svg")}
							style={seekIconStyle}
						/>
					</Pressable>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={status.playing ? "Pause" : "Play"}
						onPress={withHaptic(handlePlayPause)}
					>
						{status.playing ? (
							<Image
								source={require("@/assets/icons/pause.svg")}
								style={playPauseIconStyle}
							/>
						) : (
							<Image
								source={require("@/assets/icons/play.svg")}
								style={playPauseIconStyle}
							/>
						)}
					</Pressable>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Forward 30 seconds"
						onPress={withHaptic(() => handleSeekTo(currentTime + 30))}
					>
						<Image
							source={require("@/assets/icons/forward_30s.svg")}
							style={seekIconStyle}
						/>
					</Pressable>
				</View>

				<Pressable
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
				</Pressable>
			</View>
		</View>
	);
};

export default TeachingAudioPlayer;
