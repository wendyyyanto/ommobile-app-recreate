import TeachingCard from "@/components/ui/TeachingCard";
import fonts from "@/constants/fonts";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import {
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const Teachings = () => {
	const {
		setIsLoadingPopularTeachings,
		popularTeachings,
		isLoadingPopularTeachings,
		setPopularTeachings
	} = useTeachingStore();

	useEffect(() => {
		setIsLoadingPopularTeachings(true);
		getTeachings(
			{ page: 1, limit: 10 },
			{
				onSuccess: (data) => {
					setPopularTeachings(data.data);
					setIsLoadingPopularTeachings(false);
				},
				onError: (error) => {
					console.log(error);
					setIsLoadingPopularTeachings(false);
				}
			}
		);
	}, []);

	const teachingCategories = [
		{ name: "New Testament", id: "new-testament" },
		{ name: "Topical", id: "topical" },
		{ name: "Old Testament", id: "old-testament" },
		{ name: "Workshop", id: "workshop" }
	];

	if (isLoadingPopularTeachings) {
		return (
			<View className="flex-1 justify-center items-center">
				<Text className="text-black text-lg font-semibold">
					Loading...
				</Text>
			</View>
		);
	}

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top"]} className="flex-1">
				<View className="flex-1 px-4 font-poppins">
					<View className="flex-row justify-between items-start mb-6">
						<Text className="text-3xl w-2/5 text-white font-poppins">
							Bible Teachings
						</Text>
						<Pressable
							className="rounded-full px-5 py-5 bg-slate-gray"
							onPress={() => router.push("/teachings/search")}
						>
							<Image
								source={require("@/assets/icons/search_icon.svg")}
								style={{ width: 14, height: 14 }}
							/>
						</Pressable>
					</View>
					<View className="flex flex-row flex-wrap gap-2 mb-11">
						{teachingCategories.map((category) => (
							<Pressable
								key={category.id}
								className="basis-[48%] flex-1 flex-row justify-between items-center p-4 rounded-full bg-transparent border border-slate-gray-blue"
								onPress={() =>
									router.push(
										`/teachings/section/${category.id}?name=${category.name}`
									)
								}
							>
								<Text
									style={fonts.body1White}
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{category.name}
								</Text>
								<Image
									source={require("@/assets/icons/chevron_right.svg")}
									style={{
										width: 28,
										height: 28,
										marginRight: -6
									}}
								/>
							</Pressable>
						))}
					</View>

					<View className="flex-1 gap-4">
						<Text style={fonts.subtitle1White}>
							Popular Teachings
						</Text>
						<ScrollView
							className="flex-1"
							showsVerticalScrollIndicator={false}
						>
							<View className="flex flex-1 flex-col gap-4">
								{popularTeachings?.length > 0 &&
									popularTeachings?.map((teaching) => (
										<TeachingCard
											key={teaching.id}
											teaching={teaching}
										/>
									))}
							</View>
						</ScrollView>
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default Teachings;
