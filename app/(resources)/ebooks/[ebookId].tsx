import BackButton from "@/components/ui/BackButton";
import PressableScale from "@/components/ui/PressableScale";
import colors from "@/constants/colors";
import { CONTENT_FADE } from "@/constants/motion";
import {
	SkeletonBone,
	SkeletonLine
} from "@/features/skeletons/ContentSkeletons";
import PdfViewer from "@/features/teaching/PdfViewer";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getEbookDetails } from "@/services/ebookServices";
import { EbookDetails } from "@/types/ebook";
import {
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View
} from "react-native";
import Animated from "react-native-reanimated";
import {
	SafeAreaView,
	useSafeAreaInsets
} from "react-native-safe-area-context";

const OVERVIEW_LINE_WIDTHS = ["100%", "94%", "98%", "88%", "62%"] as const;

const EbookDetailSkeleton = ({ buttonBottom }: { buttonBottom: number }) => (
	<View
		style={styles.safeArea}
		accessible
		accessibilityRole="progressbar"
		accessibilityLabel="Loading e-book"
	>
		<View style={styles.content}>
			<View style={styles.bookSummary}>
				<View style={[styles.coverImage, { overflow: "hidden" }]}>
					<View style={StyleSheet.absoluteFill}>
						<SkeletonBone height="100%" width="100%" radius={14} />
					</View>
				</View>
				<View style={{ marginTop: 44, width: "62%" }}>
					<SkeletonLine font={{ ...styles.title, marginTop: 0 }} width="100%" />
				</View>
				<View style={{ marginTop: 8, width: "38%" }}>
					<SkeletonLine font={{ ...styles.author, marginTop: 0 }} width="100%" />
				</View>
				<View style={{ marginTop: 8, width: "32%" }}>
					<SkeletonLine font={styles.metadataText} width="100%" />
				</View>
			</View>
			<View style={styles.tags}>
				{[64, 88, 72].map((width) => (
					<SkeletonBone key={width} height={26} width={width} radius="round" />
				))}
			</View>
			<View style={styles.overview}>
				<Text style={styles.overviewTitle}>Overview</Text>
				<View>
					{OVERVIEW_LINE_WIDTHS.map((width) => (
						<SkeletonLine key={width} font={styles.overviewText} width={width} />
					))}
				</View>
			</View>
		</View>
		<View style={[styles.buttonContainer, { bottom: buttonBottom }]}>
			<View style={{ flex: 1 }}>
				<SkeletonBone height={50} width="100%" radius={32} />
			</View>
		</View>
	</View>
);

export default function EbookDetailScreen() {
	const { ebookId } = useLocalSearchParams<{ ebookId: string }>();
	const [ebookDetail, setEbookDetail] = useState<EbookDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isReading, setIsReading] = useState(false);
	const insets = useSafeAreaInsets();
	// same rule as the tab bar: iOS buttons may sit inside the home indicator inset
	const buttonBottom = Platform.OS === "ios" ? 16 : 16 + insets.bottom;

	useEffect(() => {
		setIsLoading(true);
		void getEbookDetails(ebookId, {
			onSuccess: (response) => setEbookDetail(response.data),
			onError: (error) => console.log(error),
			onFulfilled: () => setIsLoading(false)
		});
	}, [ebookId]);

	return (
		<LinearGradient
			colors={["#233A58", "#0A111A", colors.black, colors.black]}
			locations={[0, 0.28, 0.58, 1]}
			style={styles.screen}
		>
			<SafeAreaView edges={["top"]} style={styles.safeArea}>
				<View style={styles.backButton}>
					<BackButton />
				</View>

				{isLoading ? (
					<EbookDetailSkeleton buttonBottom={buttonBottom} />
				) : !ebookDetail ? (
					<View style={styles.loading}>
						<Text style={styles.overviewText}>Ebook not found.</Text>
					</View>
				) : (
					<Animated.View entering={CONTENT_FADE} style={styles.safeArea}>
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={[
								styles.content,
								{ paddingBottom: 96 + buttonBottom }
							]}
						>
							<View style={styles.bookSummary}>
								<Image
									source={
										ebookDetail.cover_file
											? { uri: ebookDetail.cover_file.url }
											: require("@/assets/images/ebooks.png")
									}
									style={styles.coverImage}
									contentFit="cover"
									transition={300}
								/>
								<Text style={styles.title}>{ebookDetail.title}</Text>
								<Text style={styles.author}>{ebookDetail.author}</Text>
								<View style={styles.metadata}>
									<Text style={styles.metadataText}>
										{ebookDetail.language}
									</Text>
									<View style={styles.metadataDot} />
									<Text style={styles.metadataText}>
										{ebookDetail.total_pages} pages
									</Text>
								</View>
							</View>

							<View style={styles.tags}>
								{ebookDetail.tags.map((tag) => (
									<View key={tag.id} style={styles.tag}>
										<Text style={styles.tagText}>{tag.label}</Text>
									</View>
								))}
							</View>

							<View style={styles.overview}>
								<Text style={styles.overviewTitle}>Overview</Text>
								<Text style={styles.overviewText}>{ebookDetail.overview}</Text>
							</View>
						</ScrollView>

						<View
							style={[styles.buttonContainer, { bottom: buttonBottom }]}
						>
							<PressableScale
								style={styles.readButton}
								onPress={() => setIsReading(true)}
							>
								<Text style={styles.readButtonText}>Read Book</Text>
							</PressableScale>
						</View>
					</Animated.View>
				)}
			</SafeAreaView>
			<Modal
				visible={isReading}
				animationType="slide"
				onRequestClose={() => setIsReading(false)}
			>
				{ebookDetail && (
					<PdfViewer
						source={ebookDetail.ebook_file.url}
						onClose={() => setIsReading(false)}
					/>
				)}
			</Modal>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	safeArea: {
		flex: 1
	},
	loading: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	content: {
		paddingHorizontal: 24
	},
	backButton: {
		height: 50,
		justifyContent: "flex-end",
		paddingHorizontal: 24
	},
	bookSummary: {
		alignItems: "center"
	},
	coverImage: {
		width: "46%",
		maxWidth: 238,
		aspectRatio: 0.643,
		borderRadius: 14,
		marginTop: 48,
		backgroundColor: colors.charcoalBlue
	},
	title: {
		marginTop: 44,
		fontFamily: "Poppins_600SemiBold",
		fontSize: 20,
		color: colors.white,
		textAlign: "center"
	},
	author: {
		marginTop: 8,
		fontFamily: "Poppins_400Regular",
		fontSize: 13,
		color: colors.lightSteelGray,
		textAlign: "center"
	},
	metadata: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginTop: 8
	},
	metadataText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 12,
		color: colors.lightSteelGray
	},
	metadataDot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.lightSteelGray
	},
	tags: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: 8,
		marginTop: 30
	},
	tag: {
		justifyContent: "center",
		minHeight: 20,
		paddingHorizontal: 12,
		paddingVertical: 3,
		borderRadius: 16,
		backgroundColor: colors.darkSlateBlue
	},
	tagText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 11,
		lineHeight: 20,
		color: colors.lightSteelGray
	},
	overview: {
		marginTop: 36,
		gap: 14
	},
	overviewTitle: {
		fontFamily: "Poppins_500Medium",
		fontSize: 13,
		color: colors.white
	},
	overviewText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 14,
		color: colors.lightSteelGray
	},
	buttonContainer: {
		position: "absolute",
		left: 24,
		right: 24,
		flexDirection: "row",
		gap: 12
	},
	readButton: {
		flex: 1,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 32,
		backgroundColor: colors.white
	},
	readButtonText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 14,
		color: colors.offBlack
	}
});
