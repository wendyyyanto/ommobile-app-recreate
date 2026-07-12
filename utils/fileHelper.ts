import { File, Paths } from "expo-file-system";
import { showErrorToast, showSuccessToast } from "./toastHelper";

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

export const downloadFileToCache = async (url: string): Promise<string> => {
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

export const handleDownloadFile = async (url: string): Promise<void> => {
	const fileName = uniqueFileName(fileNameFromUrl(url));

	try {
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
