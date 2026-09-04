import BackButton from "@/components/ui/BackButton";
import colors from "@/constants/colors";
import { TabEnum } from "@/constants/enums";
import fonts from "@/constants/fonts";
import TeachingAudioTab from "@/features/teaching/TeachingAudioTab";
import TeachingTab from "@/features/teaching/TeachingTab";
import TeachingVideoTab from "@/features/teaching/TeachingVideoTab";
import useTeachingDetail from "@/hooks/useTeachingDetail";
import { useTeachingStore } from "@/stores/teachingStore";
import { handleDownloadFile } from "@/utils/fileHelper";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
	ImageBackground,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const backgroundImage = require("@/assets/images/background.png");

const TeachingDetail = () => {
	const { activeTab, teachingDetails, setActiveTab } = useTeachingStore();
	const { handleRefreshTeachingDetail, isRefreshing } = useTeachingDetail();
	const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);
	const audioUrl = teachingDetails?.audioUrl?.trim();
	const pdfUrl = teachingDetails?.pdfUrl?.trim();
	const pptUrl = teachingDetails?.pptUrl?.trim();
	const hasBothTeachingFiles = Boolean(pdfUrl && pptUrl);
	const swipeToAudioGesture = Gesture.Pan()
		.enabled(activeTab === TabEnum.VIDEO)
		.activeOffsetX([-30, 30])
		.failOffsetY([-20, 20])
		.onEnd(({ translationX, velocityX }) => {
			if (translationX >= 50 || velocityX >= 500) {
				setActiveTab(TabEnum.AUDIO);
			}
		})
		.runOnJS(true);

	useEffect(() => {
		setIsFileDropdownOpen(false);
	}, [pdfUrl, pptUrl]);

	const downloadTeachingFile = (url: string) => {
		setIsFileDropdownOpen(false);
		Toast.show({
			type: "info",
			text1: "Downloading file...",
			text2: "Please wait while we download the file...",
			visibilityTime: 6000
		});
		handleDownloadFile(url);
	};

	const handleFileButtonPress = () => {
		if (pdfUrl && pptUrl) {
			setIsFileDropdownOpen((isOpen) => !isOpen);
			return;
		}

		const availableFileUrl = pptUrl || pdfUrl;
		if (availableFileUrl) downloadTeachingFile(availableFileUrl);
	};

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top", "bottom"]} className="flex-1">
				<GestureDetector gesture={swipeToAudioGesture}>
					<ScrollView
						className="flex-1"
						contentContainerStyle={{
							flexGrow: 1,
							paddingHorizontal: 16
						}}
						showsVerticalScrollIndicator={false}
						alwaysBounceVertical
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={handleRefreshTeachingDetail}
								tintColor={colors.black}
								colors={[colors.black]}
							/>
						}
					>
						<View className="flex gap-8">
							<BackButton />

							<TeachingTab />
						</View>

						<View className="mt-20">
							{activeTab === TabEnum.AUDIO && <TeachingAudioTab />}
							{activeTab === TabEnum.VIDEO && <TeachingVideoTab />}
						</View>

						<View className="flex-row justify-between items-center mt-20 gap-4">
							{(pptUrl || pdfUrl) && (
								<View style={styles.downloadButtonSlot}>
									<Pressable
										style={[
											styles.downloadButton,
											styles.fullWidthDownloadButton,
											hasBothTeachingFiles && styles.downloadDropdownButton
										]}
										onPress={handleFileButtonPress}
									>
										<Image
											source={
												hasBothTeachingFiles
													? require("@/assets/icons/download.svg")
													: pptUrl
														? require("@/assets/icons/ppt.svg")
														: require("@/assets/icons/pdf.svg")
											}
											style={{ width: 16, height: 16 }}
										/>
										<Text style={fonts.caption2White}>
											{hasBothTeachingFiles
												? "Download File"
												: `Download ${pptUrl ? "Ppt" : "Pdf"}`}
										</Text>
										{hasBothTeachingFiles && (
											<MotiView
												animate={{
													rotate: isFileDropdownOpen ? "180deg" : "0deg"
												}}
												transition={{ type: "timing", duration: 200 }}
											>
												<Image
													source={require("@/assets/icons/chevron_Down.svg")}
													style={{ width: 16, height: 16 }}
												/>
											</MotiView>
										)}
									</Pressable>

									{isFileDropdownOpen && hasBothTeachingFiles && (
										<View style={styles.fileDropdown}>
											<Pressable
												style={styles.fileDropdownOption}
												onPress={() => {
													if (pptUrl) downloadTeachingFile(pptUrl);
												}}
											>
												<Image
													source={require("@/assets/icons/ppt.svg")}
													style={{ width: 20, height: 20 }}
												/>
												<Text style={fonts.caption2White}>PPT File</Text>
											</Pressable>
											<View style={styles.fileDropdownSeparator} />
											<Pressable
												style={styles.fileDropdownOption}
												onPress={() => {
													if (pdfUrl) downloadTeachingFile(pdfUrl);
												}}
											>
												<Image
													source={require("@/assets/icons/pdf.svg")}
													style={{ width: 20, height: 20 }}
												/>
												<Text style={fonts.caption2White}>PDF File</Text>
											</Pressable>
										</View>
									)}
								</View>
							)}
							{activeTab === TabEnum.AUDIO && audioUrl && (
								<View style={styles.downloadButtonSlot}>
									<Pressable
										style={[
											styles.downloadButton,
											styles.fullWidthDownloadButton
										]}
										onPress={() => {
											Toast.show({
												type: "info",
												text1: "Downloading file...",
												text2:
													"It might take a few minutes to finish the download, please wait...",
												visibilityTime: 6000
											});
											handleDownloadFile(audioUrl);
										}}
									>
										<Image
											source={require("@/assets/icons/audio.svg")}
											style={{ width: 16, height: 16 }}
										/>
										<Text style={fonts.caption2White}>Download Audio</Text>
									</Pressable>
								</View>
							)}
						</View>
					</ScrollView>
				</GestureDetector>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	downloadButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 16,
		height: 52,
		borderWidth: 1,
		borderColor: colors.slateGrayBlue,
		borderRadius: 40,
		paddingHorizontal: 24,
		paddingVertical: 16
	},
	downloadDropdownButton: {
		gap: 8,
		paddingHorizontal: 12
	},
	downloadButtonSlot: {
		flex: 1,
		minWidth: 0,
		position: "relative",
		zIndex: 1
	},
	fullWidthDownloadButton: {
		width: "100%"
	},
	fileDropdown: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: "100%",
		marginBottom: 8,
		backgroundColor: colors.charcoalBlue,
		borderWidth: 1,
		borderColor: colors.slateGrayBlue,
		borderRadius: 12,
		overflow: "hidden",
		zIndex: 2,
		elevation: 4
	},
	fileDropdownOption: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 14
	},
	fileDropdownSeparator: {
		height: 1,
		backgroundColor: colors.slateGrayBlue
	}
});

export default TeachingDetail;
