import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

interface EbookCardProps {
	id: number;
	title: string;
	author: string;
	coverImage: string;
	pdfUrl: string;
	tags: string[];
}

export default function EbookCard({
	ebookDetails
}: {
	ebookDetails: EbookCardProps;
}) {
	return (
		<Pressable
			className="flex flex-1 flex-row bg-charcoal-blue rounded-2xl py-3 px-4 gap-4"
			onPress={() => {}}
		>
			<Image
				source={{ uri: ebookDetails.coverImage }}
				style={{ width: 62, height: 62, borderRadius: 16 }}
				transition={1000}
				contentFit="cover"
			/>
			<View className="flex-1 flex-col gap-1">
				<Text style={fonts.subtitle1White}>{ebookDetails.title}</Text>
				<Text style={fonts.caption1Grey}>{ebookDetails.author}</Text>
				<View className="flex-row gap-2">
					{ebookDetails.tags.map((tag) => (
						<Text
							key={tag}
							style={fonts.caption1Grey}
							className="bg-dark-slate-blue rounded-full px-2 py-1"
						>
							{tag}
						</Text>
					))}
				</View>
			</View>
		</Pressable>
	);
}
