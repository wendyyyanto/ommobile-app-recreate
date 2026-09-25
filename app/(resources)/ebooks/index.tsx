import EbookCard from "@/components/ui/EbookCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getEbooks } from "@/services/ebookServices";
import { EbookSummary } from "@/types/ebook";

export default function EBooksResourcesScreen() {
	const [ebooks, setEbooks] = useState<EbookSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");

	// Debounced search; cleanup cancels the pending timer and ignores stale responses.
	useEffect(() => {
		let ignore = false;
		const timeout = setTimeout(
			() => {
				setIsLoading(true);
				void getEbooks(query, {
					onSuccess: (response) => !ignore && setEbooks(response.data),
					onError: (error) => console.log(error),
					onFulfilled: () => !ignore && setIsLoading(false)
				});
			},
			query ? 500 : 0
		);
		return () => {
			ignore = true;
			clearTimeout(timeout);
		};
	}, [query]);

	return (
		<SafeAreaView edges={["top"]} className="flex-1 flex-col gap-7 px-4 py-5">
			<View className="flex-row items-center gap-4">
				<Pressable
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
			{isLoading ? (
				<View className="flex-1 justify-center">
					<LoadingSpinner />
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
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
				</ScrollView>
			)}
		</SafeAreaView>
	);
}
