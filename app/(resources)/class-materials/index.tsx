import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const classMaterialsList = [
	{
		category: "Christian Living",
		classes: [
			{ id: 1, name: "Christian Growth 1", duration: 12 },
			{ id: 2, name: "Christian Growth 2", duration: 12 }
		]
	},
	{
		category: "Ministry",
		classes: [
			{
				id: 3,
				name: "Understanding Ministry",
				duration: 5
			},
			{
				id: 4,
				name: "Servant Leadership",
				duration: 10
			}
		]
	},
	{
		category: "Biblical Knowledge",
		classes: [
			{
				id: 5,
				name: "Introduction to the Bible",
				duration: 5
			},
			{
				id: 7,
				name: "Inductive Study",
				duration: 10
			},
			{
				id: 8,
				name: "Christian Principles",
				duration: 10
			}
		]
	}
];

export default function ClassMaterialsScreen() {
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
				<Text style={fonts.body2White}>Class Materials</Text>
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
					placeholder="Search class..."
					placeholderTextColor={colors.lightSteelGray}
					style={[fonts.body1White]}
					className="w-full"
					textAlignVertical="center"
					onChangeText={() => {}}
				/>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="flex-1 pb-8 gap-3">
					{classMaterialsList?.map((item, index) => (
						<View key={index}>
							<Text style={fonts.subtitle1White} className="mb-2">
								{item.category}
							</Text>
							<View className="flex gap-3">
								{item.classes.map((classItem) => (
									<Pressable
										key={classItem.id}
										className="flex flex-col gap-1 px-4 py-3 bg-charcoal-blue rounded-2xl"
										onPress={() =>
											router.push(
												`/class-materials/${classItem.id}`
											)
										}
									>
										<Text style={fonts.subtitle1White}>
											{classItem.name}
										</Text>
										<Text style={fonts.caption1Grey}>
											{classItem.duration} Weeks
										</Text>
									</Pressable>
								))}
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
