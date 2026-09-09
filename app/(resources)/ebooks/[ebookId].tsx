import BackButton from "@/components/ui/BackButton";
import colors from "@/constants/colors";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DUMMY_EBOOK_ID = 5;

const dummyEbookDetail = {
	id: DUMMY_EBOOK_ID,
	title: "The 5 love languages",
	author: "Gary Chapman",
	language: "Bahasa Indonesia",
	pageCount: 189,
	coverImage: require("@/assets/images/ebook-five-love-languages.jpg"),
	tags: [
		"Love",
		"One another",
		"Fellowship",
		"Love & Unity",
		"Church & Ministry",
		"The Gospel"
	],
	overview:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id metus at lacus mattis tincidunt et eu lacus. Morbi lectus orci, scelerisque non scelerisque ornare, varius nec ante. Vestibulum viverra magna nec maximus volutpat. Morbi luctus ultrices nisi, tristique dignissim massa suscipit, quis ullamcorper quam."
};

export default function EbookDetailScreen() {
	const { ebookId } = useLocalSearchParams<{
		ebookId?: string | string[];
	}>();
	const requestedEbookId = Array.isArray(ebookId) ? ebookId[0] : ebookId;
	const ebookDetail = {
		...dummyEbookDetail,
		id: Number(requestedEbookId) || DUMMY_EBOOK_ID
	};

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

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.content}
				>
					<View style={styles.bookSummary}>
						<Image
							source={ebookDetail.coverImage}
							style={styles.coverImage}
							contentFit="cover"
							transition={300}
						/>
						<Text style={styles.title}>{ebookDetail.title}</Text>
						<Text style={styles.author}>{ebookDetail.author}</Text>
						<View style={styles.metadata}>
							<Text style={styles.metadataText}>{ebookDetail.language}</Text>
							<View style={styles.metadataDot} />
							<Text style={styles.metadataText}>
								{ebookDetail.pageCount} pages
							</Text>
						</View>
					</View>

					<View style={styles.tags}>
						{ebookDetail.tags.map((tag) => (
							<View key={tag} style={styles.tag}>
								<Text style={styles.tagText}>{tag}</Text>
							</View>
						))}
					</View>

					<View style={styles.overview}>
						<Text style={styles.overviewTitle}>Overview</Text>
						<Text style={styles.overviewText}>{ebookDetail.overview}</Text>
					</View>
				</ScrollView>

				<View style={styles.buttonContainer}>
					<Pressable style={styles.readButton} onPress={() => {}}>
						<Text style={styles.readButtonText}>Read Book</Text>
					</Pressable>
				</View>
			</SafeAreaView>
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
		fontSize: 28,
		lineHeight: 36,
		color: colors.white,
		textAlign: "center"
	},
	author: {
		marginTop: 8,
		fontFamily: "Poppins_400Regular",
		fontSize: 18,
		lineHeight: 27,
		color: colors.lightSteelGray,
		textAlign: "center"
	},
	metadata: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		marginTop: 8
	},
	metadataText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 16,
		lineHeight: 24,
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
		minHeight: 28,
		paddingHorizontal: 12,
		paddingVertical: 3,
		borderRadius: 16,
		backgroundColor: colors.darkSlateBlue
	},
	tagText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 14,
		lineHeight: 20,
		color: colors.lightSteelGray
	},
	overview: {
		marginTop: 36,
		gap: 18
	},
	overviewTitle: {
		fontFamily: "Poppins_500Medium",
		fontSize: 17,
		lineHeight: 26,
		color: colors.white
	},
	overviewText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 17,
		lineHeight: 29,
		color: colors.lightSteelGray
	},
	buttonContainer: {
		position: "absolute",
		left: 24,
		right: 24,
		bottom: 16
	},
	readButton: {
		height: 64,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 32,
		backgroundColor: colors.white
	},
	readButtonText: {
		fontFamily: "Poppins_400Regular",
		fontSize: 18,
		lineHeight: 27,
		color: colors.offBlack
	}
});
