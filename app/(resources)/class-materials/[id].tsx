import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ClassMaterialDetails {
	id: number;
	week: number;
	title: string;
}

interface ClassMaterialsDetailsScreenProps {
	classDetails: {
		id: number;
		name: string;
		description: string;
		duration: number;
	};
	materials: ClassMaterialDetails[];
}

const classMaterialDetails: ClassMaterialsDetailsScreenProps = {
	classDetails: {
		id: 1,
		name: "Introduction to the Bible",
		description:
			"This class is for new believers in Christ or anyone who wants a full overview of the Bible. It aims to grow students’ passion to read, study, and mature through understanding Scripture.",
		duration: 5
	},
	materials: [
		{
			id: 1,
			week: 1,
			title: "Big picture"
		},
		{
			id: 2,
			week: 2,
			title: "Old testament history"
		},
		{
			id: 3,
			week: 3,
			title: "The laws and the prophets"
		},
		{
			id: 4,
			week: 4,
			title: "Gospel and new testament"
		},
		{
			id: 5,
			week: 5,
			title: "Epistles"
		}
	]
};

export default function ClassMaterialsDetailScreen() {
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
				<Text style={fonts.body2White}>
					{classMaterialDetails.classDetails.name}
				</Text>
			</View>
			<View className="flex-1 flex-col gap-4">
				<Text style={fonts.caption2Grey}>
					{classMaterialDetails.classDetails.description}
				</Text>
				<Text style={fonts.caption1Grey}>
					Total {classMaterialDetails.classDetails.duration} Weeks
				</Text>
				<ScrollView showsVerticalScrollIndicator={false}>
					{classMaterialDetails.materials.map((material) => (
						<Pressable
							className="flex flex-row justify-between items-center px-4 py-3 bg-charcoal-blue rounded-2xl mb-3"
							key={material.id}
						>
							<View className="flex flex-col gap-1">
								<Text style={fonts.caption1Grey}>
									Week {material.week}
								</Text>
								<Text style={fonts.subtitle1White}>
									{material.title}
								</Text>
							</View>
							<Image
								source={require("@/assets/icons/chevron_right.svg")}
								style={{ width: 40, height: 40 }}
							/>
						</Pressable>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
