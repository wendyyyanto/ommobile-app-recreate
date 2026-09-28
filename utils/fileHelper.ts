import { File, Paths } from "expo-file-system";
import { Platform } from "react-native";
import type { FileSystem as RNFileSystemType } from "react-native-file-access";
import Toast from "react-native-toast-message";
import { showErrorToast, showSuccessToast } from "./toastHelper";

// react-native-file-access resolves its native module while it is imported, so a
// static import throws on any binary built without it and takes down every screen
// importing this file. Load it lazily so a missing native module only fails the
// download itself.
const getNativeFileSystem = (): typeof RNFileSystemType =>
	require("react-native-file-access").FileSystem;

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

// Some asset URLs come back with raw spaces/parentheses in the path, which the
// native downloaders reject. Decode first so already-encoded URLs aren't double-encoded.
function encodeFileUrl(url: string): string {
	try {
		return encodeURI(decodeURI(url.trim()));
	} catch {
		return encodeURI(url.trim());
	}
}

export const downloadFileToCache = async (rawUrl: string): Promise<string> => {
	const url = encodeFileUrl(rawUrl);
	const fileName = fileNameFromUrl(url);
	const destination = new File(Paths.cache, fileName);
	const downloadedFile = await File.downloadFileAsync(url, destination, {
		idempotent: true
	});
	return downloadedFile.uri;
};

export const deleteCachedFile = (uri: string): void => {
	try {
		new File(uri).delete();
	} catch {
		/* best-effort cleanup */
	}
};

export const handleDownloadFile = async (rawUrl: string): Promise<void> => {
	const url = encodeFileUrl(rawUrl);
	const fileName = uniqueFileName(fileNameFromUrl(url));

	try {
		if (Platform.OS === "android") {
			const RNFileSystem = getNativeFileSystem();
			const tempFile = new File(Paths.cache, fileName);
			const downloaded = await File.downloadFileAsync(url, tempFile);
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
		await File.downloadFileAsync(url, outFile);
		showSuccessToast(
			"File downloaded successfully",
			"Access the file from your Files app"
		);
	} catch (error) {
		showErrorToast(
			"Failed to download file",
			"Something went wrong while downloading the file, please try again later or contact support"
		);
	}
};
