import colors from "@/constants/colors";
import { annoucementBanners } from "@/constants/placeholders";
import { getAnnouncements } from "@/services/announcementServices";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { getImageSource } from "@/utils/imageHelper";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Dimensions, View } from "react-native";
import {
	Extrapolation,
	interpolate,
	useSharedValue
} from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination
} from "react-native-reanimated-carousel";

const AnnouncementCarousel = () => {
	const { setAnnouncementList, announcementList } = useAnnouncementStore();
	const progress = useSharedValue<number>(0);
	const carouselRef = useRef<ICarouselInstance>(null);

	useEffect(() => {
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
	}, []);

	return (
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
				customReanimatedStyle={(progress, index, length) => {
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
	);
};

export default AnnouncementCarousel;
