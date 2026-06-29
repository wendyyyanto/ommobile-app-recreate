import { File, Paths } from "expo-file-system";
import Toast from "react-native-toast-message";

function sanitizeFileName(name: string): string {
	const cleaned = name.replace(/[/\\?%*:|"<>]/g, "_").trim();
	return cleaned.slice(0, 200) || `download-${Date.now()}`;
}

function fileNameFromUrl(url: string): string {
	try {
		const parsed = new URL(url);
		const last = parsed.pathname.split("/").filter(Boolean).pop();
		if (last) return sanitizeFileName(decodeURIComponent(last));
	} catch {
		/* invalid URL */
	}
	return `download-${Date.now()}`;
}

function uniqueFileName(base: string): string {
	const dot = base.lastIndexOf(".");
	if (dot > 0 && dot < base.length - 1) {
		return `${base.slice(0, dot)}-${Date.now()}${base.slice(dot)}`;
	}
	return `${base}-${Date.now()}`;
}

export const handleDownloadFile = async (url: string): Promise<void> => {
	const fileName = uniqueFileName(fileNameFromUrl(url));

	try {
		const outFile = new File(Paths.document, fileName);
		await File.downloadFileAsync(url, outFile);
		Toast.show({
			type: "success",
			text1: "File downloaded successfully",
			text2: "Access the file from your Files app",
			visibilityTime: 6000
		});
	} catch (error) {
		Toast.show({
			type: "error",
			text1: "Failed to download file",
			text2: "Something went wrong while downloading the file, please try again later or contact support",
			visibilityTime: 6000
		});
	}
};
