import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { annoucementBanners } from "@/constants/placeholders";
import { getAnnouncements } from "@/services/announcementServices";
import { getTeachings } from "@/services/teachingServices";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { getImageSource } from "@/utils/imageHelper";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import {
	Dimensions,
	ImageBackground,
	ScrollView,
	Text,
	View
} from "react-native";
import {
	Extrapolation,
	interpolate,
	useSharedValue
} from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

export default function Index() {
	const {
		setIsLoadingTeachingList,
		setTeachingList,
		teachingList,
		isLoadingTeachingList
	} = useTeachingStore();
	const { setAnnouncementList, announcementList } = useAnnouncementStore();
	const progress = useSharedValue<number>(0);
	const carouselRef = useRef<ICarouselInstance>(null);

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

		getAnnouncements({
			onSuccess: (data) => {
				if (data.length > 0) {
					setAnnouncementList(data);
				} else {
					setAnnouncementList(annoucementBanners);
				}
			},
			onError: (error) => {
				console.log(error);
			}
		});

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

						<View className="flex-1 justify-center items-center">
							<Carousel
								ref={carouselRef}
								autoPlay={true}
								autoPlayInterval={2000}
								snapEnabled={true}
								data={announcementList}
								loop={true}
								pagingEnabled={true}
								mode="parallax"
								modeConfig={{
									parallaxScrollingScale: 0.86,
									parallaxScrollingOffset: 68
								}}
								onProgressChange={progress}
								width={Dimensions.get("window").width}
								height={200}
								renderItem={({ item }) => (
									<Image
										source={getImageSource(item.bannerUrl)}
										style={{
											width: "100%",
											height: "100%",
											borderRadius: 16
										}}
										contentFit="cover"
									/>
								)}
							/>
							<Pagination.Custom
								progress={progress}
								data={announcementList}
								size={8}
								dotStyle={{
									backgroundColor: colors.charcoalSlate,
									borderRadius: 50,
									height: 4
								}}
								activeDotStyle={{
									backgroundColor: colors.lightGray,
									overflow: "hidden",
									width: 20,
									height: 4
								}}
								customReanimatedStyle={(
									progress,
									index,
									length
								) => {
									let val = Math.abs(progress - index);
									if (index === 0 && progress > length - 1) {
										val = Math.abs(progress - length);
									}

									return {
										transform: [
											{
												translateY: interpolate(
													val,
													[0, 1],
													[0, 0],
													Extrapolation.CLAMP
												)
											}
										]
									};
								}}
								containerStyle={{ gap: 4, marginTop: 10 }}
								onPress={() => {}}
							/>
						</View>

						<View className="flex flex-1 gap-2 px-4">
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
