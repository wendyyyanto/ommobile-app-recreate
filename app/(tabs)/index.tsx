import TeachingCard from "@/components/ui/TeachingCard";
import fonts from "@/constants/fonts";
import AnnouncementCarousel from "@/features/home/AnnouncementCarousel";
import HomePageSkeleton from "@/features/skeletons/HomePageSkeleton";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

export default function Index() {
	const [user, setUser] = useState({
		name: "Wendy"
	});

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

	if (isLoadingLatestTeachings) return <HomePageSkeleton />;

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
					<View className="flex-1 flex flex-col gap-6 px-4">
						<View className="flex flex-row justify-between items-end">
							<View className="flex flex-1 flex-col gap-1">
								<Text
									className="font-poppins !text-light-steel-gray w-1/2 mt-8"
									style={fonts.body1White}
								>
									Welcome back,
								</Text>
								<Text className="font-poppins text-white w-1/2 text-3xl">
									{user.name}
								</Text>
							</View>
							<Pressable
								hitSlop={12}
								className="z-10"
								onPress={() =>
									router.push("/notifications/settings")
								}
							>
								<Ionicons
									name="settings-outline"
									size={24}
									color="white"
								/>
							</Pressable>
						</View>

						<AnnouncementCarousel />

						<View className="flex flex-col gap-4">
							<Text style={fonts.subtitle1White}>Resources</Text>
							<View className="flex flex-row gap-3">
								<Pressable
									className="bg-charcoal-blue border-dark-slate-blue border rounded-3xl flex-1 p-4"
									onPress={() => {
										router.push("/(resources)/ebooks");
									}}
								>
									<Image
										source={require("@/assets/images/ebooks.png")}
										style={{
											width: 40,
											height: 40,
											marginBottom: 12
										}}
									/>
									<Text
										style={[
											fonts.subtitle1White,
											{ marginBottom: 4 }
										]}
									>
										E-Books
									</Text>
									<Text style={fonts.caption1Grey}>
										Biblical books to strengthen your faith.
									</Text>
								</Pressable>
								<Pressable
									className="bg-charcoal-blue border-dark-slate-blue border rounded-3xl flex-1 p-4"
									onPress={() => {
										router.push(
											"/(resources)/class-materials"
										);
									}}
								>
									<Image
										source={require("@/assets/images/classmaterial.png")}
										style={{
											width: 40,
											height: 40,
											marginBottom: 12
										}}
									/>
									<Text
										style={[
											fonts.subtitle1White,
											{ marginBottom: 4 }
										]}
									>
										Class Materials
									</Text>
									<Text style={fonts.caption1Grey}>
										Material from OM classes.
									</Text>
								</Pressable>
							</View>
						</View>

						<View className="flex flex-1 gap-2">
							<View className="flex-1 flex-row justify-between items-center">
								<Text
									style={fonts.subtitle1White}
									className="pr-3 flex-1"
								>
									Latest Teachings
								</Text>
								<Pressable
									className="bg-charcoal-blue rounded-full py-2 w-1/4"
									onPress={() => router.push("/teachings")}
								>
									<Text
										style={[
											fonts.caption1White,
											{
												color: "rgba(255, 255, 255, 0.7)"
											}
										]}
										className="text-center"
									>
										Browse All
									</Text>
								</Pressable>
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
