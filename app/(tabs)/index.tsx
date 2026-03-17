import TeachingCard from "@/components/ui/TeachingCard";
import fonts from "@/constants/fonts";
import AnnouncementCarousel from "@/features/home/AnnouncementCarousel";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { Link } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

export default function Index() {
	const {
		setIsLoadingLatestTeachings,
		setLatestTeachings,
		latestTeachings,
		isLoadingLatestTeachings
	} = useTeachingStore();

	useEffect(() => {
		setIsLoadingLatestTeachings(true);
		getTeachings(
			{ page: 1, limit: 10 },
			{
				onSuccess: (data) => {
					setLatestTeachings(data.data);
					setIsLoadingLatestTeachings(false);
				},
				onError: (error) => {
					console.log(error);
					setIsLoadingLatestTeachings(false);
				}
			}
		);

		return () => {};
	}, []);

	if (isLoadingLatestTeachings) {
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
			<SafeAreaView edges={["top"]} className="flex-1">
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
				>
					<View className="flex-1 flex flex-col gap-8 px-4">
						<Text className="font-poppins text-3xl text-white w-1/2">
							Listen
							<Text className="color-slate-gray">.</Text> Learn
							<Text className="color-slate-gray">
								. Grow
							</Text>{" "}
							closer
							<Text className="color-slate-gray"> to God.</Text>
						</Text>

						<AnnouncementCarousel />

						<View className="flex flex-1 gap-2">
							<View className="flex flex-1 flex-row justify-between items-center">
								<Text style={fonts.subtitle1White}>
									Latest Teachings
								</Text>
								<Link
									href="/teachings"
									className="bg-charcoal-blue rounded-full px-4 py-2"
								>
									<Text style={fonts.caption1White}>
										Browse All
									</Text>
								</Link>
							</View>
							<View className="flex flex-1 gap-4">
								{latestTeachings?.length > 0 &&
									latestTeachings?.map((teaching) => (
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
