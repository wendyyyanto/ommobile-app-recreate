import fonts from "@/constants/fonts";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const resourcesList = [
	{
		id: 1,
		title: "Members of one another",
		author: "Dennis Mccalum",
		coverImage: "path/to/members-of-one-another.jpg",
		pdfUrl: "path/to/members-of-one-another.pdf",
		tags: ["Fellowship", "Love", "Body"]
	},
	{
		id: 2,
		title: "How good is good enough",
		author: "Andy Stanley",
		coverImage: "path/to/how-good-is-good-enough.jpg",
		pdfUrl: "path/to/how-good-is-good-enough.pdf",
		tags: ["Salvation", "Good deeds"]
	},
	{
		id: 3,
		title: "The marriage builder",
		author: "Dr Larry Crabb",
		coverImage: "path/to/the-marriage-builder.jpg",
		pdfUrl: "path/to/the-marriage-builder.pdf",
		tags: ["Marriage", "Relationship"]
	},
	{
		id: 4,
		title: "Resolving everyday conflict",
		author: "Ken Sande",
		coverImage: "path/to/resolving-everyday-conflict.jpg",
		pdfUrl: "path/to/resolving-everyday-conflict.pdf",
		tags: ["Conflict", "Fellowship", "Body"]
	},
	{
		id: 5,
		title: "The 5 love languages",
		author: "Gary Chapman",
		coverImage: "path/to/the-5-love-languages.jpg",
		pdfUrl: "path/to/the-5-love-languages.pdf",
		tags: ["Love", "One another", "Fellowship"]
	},
	{
		id: 6,
		title: "How good is good enough",
		author: "Andy Stanley",
		coverImage: "path/to/how-good-is-good-enough-2.jpg",
		pdfUrl: "path/to/how-good-is-good-enough-2.pdf",
		tags: ["Salvation", "Good deeds"]
	}
];

export default function EBooksResourcesScreen() {
	return (
		<SafeAreaView edges={["top"]} className="flex-1">
			<View className="flex-1 flex flex-col gap-6 px-4">
				<Text style={fonts.subtitle1White}>E-Books</Text>
			</View>
		</SafeAreaView>
	);
}
