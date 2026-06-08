import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import useTeachingAudioPlayer from "@/hooks/useTeachingAudioPlayer";
import { formatDuration } from "@/utils/timeHelper";
import { Slider } from "@tamagui/slider";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

const playPauseIconStyle = { width: 68, height: 68 };
const seekIconStyle = { width: 36, height: 36 };

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
		return (
			<LoadingSpinner label="Please wait while we load the audio ..." />
		);

	return (
		<View className="w-full">
			<Slider
				style={{
					width: "95%",
					alignSelf: "center",
					marginTop: 28,
					marginBottom: 18
				}}
				size="$2"
				value={[currentTime ?? 0]}
				max={status.duration ?? 0}
				step={1}
				onSlideEnd={(e, value) => handleSeekTo(value)}
				onSlideMove={(e, value) => {
					handleSlideMove(value);
				}}
			>
				<Slider.Track height={7}>
					<Slider.TrackActive
						style={{ backgroundColor: colors.steelBlue }}
					/>
				</Slider.Track>
				<Slider.Thumb
					circular
					index={0}
					borderWidth={0}
					backgroundColor={colors.lightBlue}
				/>
			</Slider>
			<View className="flex-row justify-between">
				<Text className="text-white">
					{formatDuration(currentTime)}
				</Text>
				<Text className="text-white">{formatDuration(duration)}</Text>
			</View>

			<View className="flex-row justify-between items-center mt-5">
				{status.isBuffering ? (
					<View className="flex-1 justify-center items-center">
						<LoadingSpinner
							label="Buffering audio ..."
							size={70}
							styleProps={{ opacity: 0.3 }}
						/>
					</View>
				) : (
					<>
						<View className="w-11 h-11" />
						<View className="flex-row justify-center items-center gap-8">
							<Pressable
								onPress={() => handleSeekTo(currentTime - 15)}
							>
								<Image
									source={require("@/assets/icons/backward_15s.svg")}
									style={seekIconStyle}
								/>
							</Pressable>
							<Pressable onPress={handlePlayPause}>
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
								onPress={() => handleSeekTo(currentTime + 30)}
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
							onPress={handleChangePlaybackRate}
						>
							<Text className="text-white ">{playbackRate}x</Text>
						</Pressable>
					</>
				)}
			</View>
		</View>
	);
};

export default TeachingAudioPlayer;
