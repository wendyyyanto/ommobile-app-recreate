import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { deleteCachedFile, downloadFileToCache } from "@/utils/fileHelper";
import { showErrorToast } from "@/utils/toastHelper";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";

const PdfViewer = ({
	source,
	onClose
}: {
	source: string;
	onClose: () => void;
}) => {
	const [localPath, setLocalPath] = useState<string | null>(null);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
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
	}, [source]);

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
				<BackButton onPress={onClose} />
			</View>
			{localPath ? (
				<Pdf
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
