import moment from "moment";

export const formatDuration = (totalSeconds?: number) => {
	if (!totalSeconds || Number.isNaN(totalSeconds)) return "0:00";

	const seconds = Math.max(0, Math.floor(totalSeconds));
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(
			remainingSeconds
		).padStart(2, "0")}`;
	}

	return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const formatDate = (date: string, format: string = "MM-DD-YYYY") => {
	return moment(date).format(format);
};
