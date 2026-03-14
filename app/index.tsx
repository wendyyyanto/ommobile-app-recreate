import TeachingCard from "@/components/ui/TeachingCard";
import fonts from "@/constants/fonts";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { useEffect } from "react";
import {
	ImageBackground,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

export default function Index() {
	const {
		setIsLoadingTeachingList,
		setTeachingList,
		teachingList,
		isLoadingTeachingList
	} = useTeachingStore();

	useEffect(() => {
		setIsLoadingTeachingList(true);
		getTeachings(
			{ page: 1, limit: 10, teacher: "lisa" },
			{
				onSuccess: (data) => {
					setTeachingList(data.data);
					setIsLoadingTeachingList(false);
				},
				onError: (error) => {
					console.log(error);
					setIsLoadingTeachingList(false);
				}
			}
		);

		return () => {};
	}, []);

	if (isLoadingTeachingList) {
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
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 p-4">
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
				>
					<View className="flex flex-col gap-8">
						<Text className="font-poppins text-3xl text-white w-1/2">
							Listen
							<Text className="color-slate-gray">.</Text> Learn
							<Text className="color-slate-gray">
								. Grow
							</Text>{" "}
							closer
							<Text className="color-slate-gray"> to God.</Text>
						</Text>

						<View className="flex flex-1 gap-2">
							<View className="flex flex-1 flex-row justify-between">
								<Text style={fonts.subtitle1White}>
									Latest Teachings
								</Text>
								<TouchableWithoutFeedback onPress={() => {}}>
									<View className="bg-charcoal-blue rounded-full px-3 py-2">
										<Text style={fonts.caption1White}>
											Browse All
										</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>
							<View className="flex flex-1 gap-4">
								{teachingList?.length > 0 &&
									teachingList?.map((teaching) => (
										<TeachingCard
											key={teaching.id}
											teaching={teaching}
										/>
									))}
							</View>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</ImageBackground>
	);
}
