import { File, Paths } from "expo-file-system";
import { Platform } from "react-native";
import { FileSystem as RNFileSystem } from "react-native-file-access";
import Toast from "react-native-toast-message";

function fileUriToPlainPath(uri: string): string {
	return decodeURIComponent(uri.replace(/^file:\/{2,3}/, ""));
}

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

function normalizeDownloadUrl(rawUrl: string): string {
	try {
		// URL normalizes illegal path characters (e.g. spaces) into valid encoding.
		return new URL(rawUrl).toString();
	} catch {
		// Fallback for partial or already-decoded URLs.
		return encodeURI(rawUrl.trim());
	}
}

export const handleDownloadFile = async (url: string): Promise<void> => {
	const downloadUrl = normalizeDownloadUrl(url);
	const fileName = uniqueFileName(fileNameFromUrl(downloadUrl));

	try {
		if (Platform.OS === "android") {
			const tempFile = new File(Paths.cache, fileName);
			const downloaded = await File.downloadFileAsync(downloadUrl, tempFile);
			const srcPath = fileUriToPlainPath(downloaded.uri);
			try {
				await RNFileSystem.cpExternal(srcPath, fileName, "downloads");
				Toast.show({
					type: "success",
					text1: "File downloaded successfully",
					text2: "Check your download folder to access the file",
					visibilityTime: 6000
				});
				return;
			} finally {
				await RNFileSystem.unlink(srcPath).catch(() => {});
			}
		}

		const outFile = new File(Paths.document, fileName);
		await File.downloadFileAsync(downloadUrl, outFile);
		return;
	} catch {
		Toast.show({
			type: "error",
			text1: "Failed to download file",
			text2: "Something went wrong while downloading the file, please try again later or contact support",
			visibilityTime: 6000
		});
	}
};
