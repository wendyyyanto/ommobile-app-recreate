import EbookCard from "@/components/ui/EbookCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ebooksList = [
	{
		id: 1,
		title: "Members of one another",
		author: "Dennis Mccalum",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/members-of-one-another.pdf",
		tags: ["Fellowship", "Love", "Body"]
	},
	{
		id: 2,
		title: "How good is good enough",
		author: "Andy Stanley",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/how-good-is-good-enough.pdf",
		tags: ["Salvation", "Good deeds"]
	},
	{
		id: 3,
		title: "The marriage builder",
		author: "Dr Larry Crabb",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/the-marriage-builder.pdf",
		tags: ["Marriage", "Relationship"]
	},
	{
		id: 4,
		title: "Resolving everyday conflict",
		author: "Ken Sande",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/resolving-everyday-conflict.pdf",
		tags: ["Conflict", "Fellowship", "Body"]
	},
	{
		id: 5,
		title: "The 5 love languages",
		author: "Gary Chapman",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/the-5-love-languages.pdf",
		tags: ["Love", "One another", "Fellowship"]
	},
	{
		id: 6,
		title: "How good is good enough",
		author: "Andy Stanley",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/how-good-is-good-enough-2.pdf",
		tags: ["Salvation", "Good deeds"]
	},
	{
		id: 7,
		title: "Resolving everyday conflict",
		author: "Ken Sande",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/resolving-everyday-conflict.pdf",
		tags: ["Conflict", "Fellowship", "Body"]
	},
	{
		id: 8,
		title: "The 5 love languages",
		author: "Gary Chapman",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/the-5-love-languages.pdf",
		tags: ["Love", "One another", "Fellowship"]
	},
	{
		id: 9,
		title: "How good is good enough",
		author: "Andy Stanley",
		coverImage: "https://i.ibb.co.com/V8KBNDD/image.png",
		pdfUrl: "path/to/how-good-is-good-enough-2.pdf",
		tags: ["Salvation", "Good deeds"]
	}
];

export default function EBooksResourcesScreen() {
	return (
		<SafeAreaView
			edges={["top"]}
			className="flex-1 flex-col gap-7 px-4 py-5"
		>
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
					onChangeText={() => {}}
				/>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="flex-1 pb-8 gap-3">
					{ebooksList?.map((ebook) => (
						<EbookCard key={ebook.id} ebookDetails={ebook} />
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
