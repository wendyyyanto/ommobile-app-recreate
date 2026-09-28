import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { deleteCachedFile, downloadFileToCache } from "@/utils/fileHelper";
import { showErrorToast } from "@/utils/toastHelper";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

// react-native-pdf can't render slides, so non-PDF files (ppt/pptx) are streamed
// through Office's web viewer instead. Needs a publicly reachable file URL.
const officeViewerUrl = (url: string) =>
	`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

// Office's viewer can't play media, so audio/video go through the WebView's HTML5 player.
const mediaHtml = (url: string, media: "video" | "audio") => `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<style>html,body{margin:0;height:100%;background:#000}
body{display:flex;align-items:center;justify-content:center}
video{width:100%;max-height:100%}audio{width:calc(100% - 32px)}</style></head>
<body><${media} src="${url.replace(/"/g, "&quot;")}" controls autoplay playsinline></${media}></body></html>`;

const PdfViewer = ({
	source,
	isPdf = true,
	media,
	onClose
}: {
	source: string;
	isPdf?: boolean;
	media?: "video" | "audio";
	onClose: () => void;
}) => {
	const [localPath, setLocalPath] = useState<string | null>(null);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		if (!isPdf) return;
		let cancelled = false;
		let downloadedPath: string | null = null;
		setLocalPath(null);

		downloadFileToCache(source)
			.then((path) => {
				if (cancelled) {
					// viewer was closed before the download finished, don't leave it on disk
					deleteCachedFile(path);
					return;
				}
				downloadedPath = path;
				setLocalPath(path);
			})
			.catch(() => {
				if (cancelled) return;
				showErrorToast(
					"Failed to load file",
					"Something went wrong while downloading the file, please try again later or contact support"
				);
				onCloseRef.current();
			});

		return () => {
			cancelled = true;
			// the file is only kept around while the viewer is open, not saved on device
			if (downloadedPath) deleteCachedFile(downloadedPath);
		};
	}, [source, isPdf]);

	useEffect(() => {
		ScreenOrientation.unlockAsync();

		return () => {
			ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP
			);
		};
	}, []);

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
				<BackButton onPress={onClose} />
			</View>
			{media ? (
				<WebView
					source={{ html: mediaHtml(source, media) }}
					style={styles.pdf}
					allowsFullscreenVideo
					allowsInlineMediaPlayback
					mediaPlaybackRequiresUserAction={false}
				/>
			) : !isPdf ? (
				<WebView
					source={{ uri: officeViewerUrl(source) }}
					style={styles.pdf}
					startInLoadingState
					renderLoading={() => (
						<View style={styles.loadingContainer}>
							<LoadingSpinner label="Loading file..." />
						</View>
					)}
					onError={() => {
						showErrorToast(
							"Failed to load file",
							"Something went wrong while loading the file, please try again later or contact support"
						);
						onClose();
					}}
				/>
			) : localPath ? (
				<Pdf
					enablePaging
					source={{ uri: localPath }}
					trustAllCerts={false}
					onError={(error) => {
						console.log(error);
					}}
					onPressLink={(uri) => {
						console.log(`Link pressed: ${uri}`);
					}}
					style={styles.pdf}
				/>
			) : (
				<View style={styles.loadingContainer}>
					<LoadingSpinner label="Downloading file..." />
				</View>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black"
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	pdf: {
		flex: 1,
		width: "100%"
	}
});

export default PdfViewer;
