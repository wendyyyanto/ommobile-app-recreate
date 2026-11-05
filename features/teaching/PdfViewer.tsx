import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { deleteCachedFile, downloadFileToCache } from "@/utils/fileHelper";
import { showErrorToast } from "@/utils/toastHelper";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Pdf, { type PdfRef } from "react-native-pdf";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 1.25;
const clampScale = (value: number) =>
	Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

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
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const [scale, setScale] = useState(1);
	const pdfRef = useRef<PdfRef>(null);
	// pinch gestures report here without touching the `scale` prop: on Android a prop change redraws the document
	const liveScaleRef = useRef(1);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		if (!isPdf) return;
		let cancelled = false;
		let downloadedPath: string | null = null;
		setLocalPath(null);
		setPage(1);
		setPageCount(0);
		setScale(1);
		liveScaleRef.current = 1;

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

	const goToPage = (target: number) => {
		if (target < 1 || target > pageCount) return;
		pdfRef.current?.setPage(target);
	};

	const zoomBy = (factor: number) =>
		setScale(clampScale(liveScaleRef.current * factor));

	const canPrev = page > 1;
	const canNext = page < pageCount;

	// Modal content is mounted outside the root SafeAreaProvider natively, so
	// SafeAreaView would read zero insets without a provider of its own.
	return (
		<SafeAreaProvider>
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
					<>
						<View style={styles.controls}>
							<Pressable
								style={styles.iconButton}
								disabled={!canPrev}
								onPress={() => goToPage(page - 1)}
								accessibilityLabel="Previous page"
							>
								<Ionicons
									name="chevron-up"
									size={22}
									color={canPrev ? "white" : colors.darkGray}
								/>
							</Pressable>
							<Text style={[fonts.subtitle2White, styles.label]}>
								{pageCount ? `${page} / ${pageCount}` : ""}
							</Text>
							<Pressable
								style={styles.iconButton}
								disabled={!canNext}
								onPress={() => goToPage(page + 1)}
								accessibilityLabel="Next page"
							>
								<Ionicons
									name="chevron-down"
									size={22}
									color={canNext ? "white" : colors.darkGray}
								/>
							</Pressable>
							<View style={styles.spacer} />
							<Pressable
								style={styles.iconButton}
								onPress={() => zoomBy(1 / ZOOM_STEP)}
								accessibilityLabel="Zoom out"
							>
								<Ionicons name="remove" size={22} color="white" />
							</Pressable>
							<Pressable
								style={styles.iconButton}
								onPress={() => zoomBy(ZOOM_STEP)}
								accessibilityLabel="Zoom in"
							>
								<Ionicons name="add" size={22} color="white" />
							</Pressable>
						</View>
						<Pdf
							ref={pdfRef}
							enablePaging
							source={{ uri: localPath }}
							scale={scale}
							minScale={MIN_SCALE}
							maxScale={MAX_SCALE}
							trustAllCerts={false}
							onLoadComplete={(numberOfPages) => setPageCount(numberOfPages)}
							onPageChanged={(current, numberOfPages) => {
								setPage(current);
								setPageCount(numberOfPages);
							}}
							onScaleChanged={(current) => {
								liveScaleRef.current = current;
							}}
							onError={(error) => {
								console.log(error);
							}}
							onPressLink={(uri) => {
								console.log(`Link pressed: ${uri}`);
							}}
							style={styles.pdf}
						/>
					</>
				) : (
					<View style={styles.loadingContainer}>
						<LoadingSpinner label="Downloading file..." />
					</View>
				)}
			</SafeAreaView>
		</SafeAreaProvider>
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
	controls: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingBottom: 8,
		gap: 4
	},
	iconButton: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center"
	},
	label: {
		minWidth: 64,
		textAlign: "center"
	},
	spacer: {
		flex: 1
	},
	pdf: {
		flex: 1,
		width: "100%"
	}
});

export default PdfViewer;
