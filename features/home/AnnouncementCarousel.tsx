import colors from "@/constants/colors";
import { SkeletonBone } from "@/features/skeletons/ContentSkeletons";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { getImageSource } from "@/utils/imageHelper";
import { Image } from "expo-image";
import { useRef } from "react";
import { Dimensions, View } from "react-native";
import { useReducedMotion, useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination
} from "react-native-reanimated-carousel";

const SKELETON_SLIDES = [
	{ id: 0, announcementTitle: "", bannerUrl: "" },
	{ id: 1, announcementTitle: "", bannerUrl: "" },
	{ id: 2, announcementTitle: "", bannerUrl: "" }
];

const AnnouncementCarousel = ({ isLoading = false }: { isLoading?: boolean }) => {
	const announcementList = useAnnouncementStore((s) => s.announcementList);
	const progress = useSharedValue<number>(0);
	const carouselRef = useRef<ICarouselInstance>(null);
	const reduced = useReducedMotion();
	const slides = isLoading ? SKELETON_SLIDES : announcementList;

	return (
		<View className="flex-1 justify-center items-center">
			<Carousel
				key={isLoading ? "loading" : "loaded"}
				ref={carouselRef}
				autoPlay={!isLoading && !reduced}
				enabled={!isLoading}
				autoPlayInterval={5000}
				snapEnabled={true}
				data={slides}
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
				renderItem={({ item }) =>
					isLoading ? (
						<SkeletonBone height="100%" width="100%" radius={16} />
					) : (
						<Image
							source={getImageSource(item.bannerUrl)}
							style={{
								width: "100%",
								height: "100%",
								borderRadius: 16
							}}
							contentFit="cover"
							transition={200}
						/>
					)
				}
			/>
			<Pagination.Custom
				progress={progress}
				data={slides}
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
				containerStyle={{ gap: 4, marginTop: 10 }}
				onPress={() => {}}
			/>
		</View>
	);
};

export default AnnouncementCarousel;
