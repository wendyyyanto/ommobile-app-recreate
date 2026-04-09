import { useTeachingStore } from "@/stores/teachingStore";
import {
	setAudioModeAsync,
	useAudioPlayer,
	useAudioPlayerStatus
} from "expo-audio";
import { useEffect, useState } from "react";

const useTeachingAudioPlayer = () => {
	const { teachingDetails } = useTeachingStore();

	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1);

	const player = useAudioPlayer({
		uri: teachingDetails?.audioUrl!
	});
	const status = useAudioPlayerStatus(player);

	useEffect(() => {
		setAudioModeAsync({
			playsInSilentMode: true,
			shouldPlayInBackground: true,
			interruptionMode: "doNotMix"
		});
	}, []);

	useEffect(() => {
		if (status.isLoaded) {
			setDuration(status.duration ?? 0);
		}
	}, [status]);

	useEffect(() => {
		if (status.currentTime) {
			setCurrentTime(status.currentTime ?? 0);
		}
	}, [status.currentTime]);

	const handlePlayPause = () => {
		if (status.playing) {
			handlePause();
		} else {
			handlePlay();
		}
	};

	const handlePlay = () => {
		player.play();
		player.setActiveForLockScreen(
			true,
			{
				title: teachingDetails?.title,
				artist: teachingDetails?.teacher,
				albumTitle: teachingDetails?.book,
				artworkUrl: teachingDetails?.thumbnailUrl
			},
			{
				showSeekBackward: true,
				showSeekForward: true
			}
		);
	};

	const handlePause = () => {
		player.pause();
		player.setActiveForLockScreen(false);
	};

	const handleSeekTo = (time: number) => {
		player.seekTo(time);
		handlePlay();
	};

	const handleSlideMove = (time: number) => {
		setCurrentTime(time);
	};

	const handleChangePlaybackRate = () => {
		if (playbackRate >= 2) {
			setPlaybackRate(1);
			player.setPlaybackRate(1);
		} else {
			setPlaybackRate(playbackRate + 0.25);
			player.setPlaybackRate(playbackRate);
		}
	};

	return {
		playbackRate,
		status,
		currentTime,
		duration,
		handleSeekTo,
		handlePlayPause,
		handleSlideMove,
		handleChangePlaybackRate
	};
};

export default useTeachingAudioPlayer;
