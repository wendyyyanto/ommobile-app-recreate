import fonts from "@/constants/fonts";
import { EbookSummary } from "@/types/ebook";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function EbookCard({
	ebookDetails
}: {
	ebookDetails: EbookSummary;
}) {
	return (
		<Pressable
			className="flex flex-1 flex-row items-center bg-charcoal-blue rounded-2xl py-2 px-4 gap-4"
			onPress={() =>
				router.push({
					pathname: "/(resources)/ebooks/[ebookId]",
					params: { ebookId: ebookDetails.id }
				})
			}
		>
			<Image
				source={
					ebookDetails.cover_url
						? { uri: ebookDetails.cover_url }
						: require("@/assets/images/ebooks.png")
				}
				style={{ width: 52, height: 77, borderRadius: 3 }}
				transition={1000}
				contentFit="cover"
			/>
			<View className="flex-1 flex-col gap-1">
				<Text style={fonts.subtitle1White} numberOfLines={1}>
					{ebookDetails.title}
				</Text>
				<Text style={[fonts.caption1Grey]} numberOfLines={1}>
					{ebookDetails.author}
				</Text>
				<View className="flex-row flex-wrap gap-2 mt-1">
					{[
						...ebookDetails.tags.slice(0, 3).map((tag) => tag.label),
						...(ebookDetails.tags.length > 3
							? [`+${ebookDetails.tags.length - 3}`]
							: [])
					].map((label) => (
						<View
							key={label}
							className="bg-dark-slate-blue rounded-full px-2 py-0.5"
						>
							<Text
								style={{
									fontSize: 11,
									color: "#B9B9B9",
									fontFamily: "Poppins_400Regular"
								}}
							>
								{label}
							</Text>
						</View>
					))}
				</View>
			</View>
		</Pressable>
	);
}
