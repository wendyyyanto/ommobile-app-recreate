import EbookCard from "@/components/ui/EbookCard";
import ErrorState from "@/components/ui/ErrorState";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { CONTENT_FADE, OPACITY_TRANSITION } from "@/constants/motion";
import { EbookListSkeleton } from "@/features/skeletons/ContentSkeletons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getEbooks } from "@/services/ebookServices";
import { EbookSummary } from "@/types/ebook";

export default function EBooksResourcesScreen() {
	const [ebooks, setEbooks] = useState<EbookSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [hasError, setHasError] = useState(false);
	const [retryCount, setRetryCount] = useState(0);

	// Debounced search; cleanup cancels the pending timer and ignores stale responses.
	useEffect(() => {
		let ignore = false;
		const timeout = setTimeout(
			() => {
				setIsLoading(true);
				setHasError(false);
				void getEbooks(query, {
					onSuccess: (response) => !ignore && setEbooks(response.data),
					onError: (error) => {
						console.log(error);
						if (!ignore) setHasError(true);
					},
					onFulfilled: () => !ignore && setIsLoading(false)
				});
			},
			query ? 500 : 0
		);
		return () => {
			ignore = true;
			clearTimeout(timeout);
		};
	}, [query, retryCount]);

	return (
		<SafeAreaView edges={["top"]} className="flex-1 flex-col gap-7 px-4 py-5">
			<View className="flex-row items-center gap-4">
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Go back"
					style={{ width: 40, height: 40 }}
					onPress={() => router.back()}
				>
					<Image
						source={require("@/assets/icons/arrow_back.svg")}
						style={{ width: 40, height: 40 }}
					/>
				</Pressable>
				<Text style={fonts.body2White}>E-Books</Text>
			</View>
			<View
				className="flex-row items-center gap-2 py-2"
				style={{
					borderBottomWidth: 0.5,
					borderColor: colors.lightSteelGray
				}}
			>
				<Image
					source={require("@/assets/icons/search_icon.svg")}
					style={{ width: 14, height: 14 }}
				/>
				<TextInput
					placeholder="Search book title, author, tags..."
					placeholderTextColor={colors.lightSteelGray}
					style={[fonts.body1White]}
					className="w-full"
					textAlignVertical="center"
					value={query}
					onChangeText={setQuery}
				/>
			</View>
			{isLoading && ebooks.length === 0 ? (
				<EbookListSkeleton count={7} />
			) : hasError ? (
				<ErrorState
					message="Couldn't load e-books. Check your connection and try again."
					onRetry={() => setRetryCount((n) => n + 1)}
				/>
			) : (
				<Animated.View entering={CONTENT_FADE} style={{ flex: 1 }}>
					<Animated.ScrollView
						showsVerticalScrollIndicator={false}
						style={[OPACITY_TRANSITION, { opacity: isLoading ? 0.5 : 1 }]}
					>
						<View className="flex-1 pb-8 gap-3">
							{ebooks.length === 0 && (
								<Text style={fonts.caption1Grey} className="text-center">
									{query ? "No ebooks found." : "No ebooks available."}
								</Text>
							)}
							{ebooks.map((ebook) => (
								<EbookCard key={ebook.id} ebookDetails={ebook} />
							))}
						</View>
					</Animated.ScrollView>
				</Animated.View>
			)}
		</SafeAreaView>
	);
}
