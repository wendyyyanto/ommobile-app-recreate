import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import PdfViewer from "@/features/teaching/PdfViewer";
import { handleDownloadFile } from "@/utils/fileHelper";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getEbookDetails } from "@/services/ebookServices";
import { EbookDetails } from "@/types/ebook";
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EbookDetailScreen() {
	const { ebookId } = useLocalSearchParams<{ ebookId: string }>();
	const [ebookDetail, setEbookDetail] = useState<EbookDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isReading, setIsReading] = useState(false);

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
			<SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
				<View style={styles.backButton}>
					<BackButton />
				</View>

				{isLoading || !ebookDetail ? (
					<View style={styles.loading}>
						{isLoading ? (
							<LoadingSpinner />
						) : (
							<Text style={styles.overviewText}>Ebook not found.</Text>
						)}
					</View>
				) : (
					<>
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.content}
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

						<View style={styles.buttonContainer}>
							<Pressable
								style={styles.readButton}
								onPress={() => {
									setIsReading(true);
									// ponytail: saves a new copy on every tap; track downloaded ids if duplicates become a problem.
									void handleDownloadFile(ebookDetail.ebook_file.url);
								}}
							>
								<Text style={styles.readButtonText}>Read Book</Text>
							</Pressable>
						</View>
					</>
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
		paddingHorizontal: 24,
		paddingBottom: 112
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
		bottom: 16
	},
	readButton: {
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
