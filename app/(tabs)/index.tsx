import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { annoucementBanners } from "@/constants/placeholders";
import AnnouncementCarousel from "@/features/home/AnnouncementCarousel";
import HomePageSkeleton from "@/features/skeletons/HomePageSkeleton";
import { getAnnouncements } from "@/services/announcementServices";
import { getTeachings } from "@/services/teachingServices";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { Announcement } from "@/types/announcement";
import { appendUniqueItems, isNearScrollEnd } from "@/utils/paginationHelper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ImageBackground,
	Pressable,
	RefreshControl,
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
		isLoadingLatestTeachings,
		isLoadMoreLatestTeachings,
		setIsLoadMoreLatestTeachings,
		setLatestTeachingsPagination
	} = useTeachingStore();
	const { setAnnouncementList } = useAnnouncementStore();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const isRefreshingRef = useRef(false);

	const fetchHomeData = useCallback(
		async (isRefresh = false) => {
			setIsLoadMoreLatestTeachings(false);

			if (isRefresh) {
				isRefreshingRef.current = true;
				setIsRefreshing(true);
			} else {
				setIsLoadingLatestTeachings(true);
			}

			await Promise.all([
				getTeachings(
					{ page: 1, limit: TEACHINGS_PAGE_SIZE },
					{
						onSuccess: (data) => {
							setLatestTeachings(data.data);
							setLatestTeachingsPagination(data.pagination);
						},
						onError: (error) => {
							console.log(error);
						}
					}
				),
				getAnnouncements({
					onSuccess: (data) => {
						const hasBanner = data.some(
							(item: Announcement) => item.bannerUrl !== null
						);
						setAnnouncementList(
							hasBanner
								? data
								: (annoucementBanners as Announcement[])
						);
					},
					onError: (error) => {
						console.log(error);
					}
				})
			]);

			if (isRefresh) {
				isRefreshingRef.current = false;
				setIsRefreshing(false);
			} else {
				setIsLoadingLatestTeachings(false);
			}
		},
		[
			setAnnouncementList,
			setIsLoadMoreLatestTeachings,
			setIsLoadingLatestTeachings,
			setLatestTeachings,
			setLatestTeachingsPagination
		]
	);

	useEffect(() => {
		void fetchHomeData();
	}, [fetchHomeData]);

	const handleRefresh = useCallback(() => {
		void fetchHomeData(true);
	}, [fetchHomeData]);

	const handleLoadMore = useCallback(async () => {
		if (isRefreshingRef.current) return;

		const {
			isLoadMoreLatestTeachings,
			isLoadingLatestTeachings,
			latestTeachingsPagination
		} = useTeachingStore.getState();

		if (
			isLoadMoreLatestTeachings ||
			isLoadingLatestTeachings ||
			latestTeachingsPagination.page >=
				latestTeachingsPagination.totalPages
		) {
			return;
		}

		setIsLoadMoreLatestTeachings(true);

		await getTeachings(
			{
				page: latestTeachingsPagination.page + 1,
				limit: TEACHINGS_PAGE_SIZE
			},
			{
				onSuccess: (data) => {
					const state = useTeachingStore.getState();

					if (!state.isLoadMoreLatestTeachings) return;

					setLatestTeachings(
						appendUniqueItems(state.latestTeachings, data.data)
					);
					setLatestTeachingsPagination(data.pagination);
				},
				onError: (error) => {
					console.log(error);
				},
				onFulfilled: () => {
					setIsLoadMoreLatestTeachings(false);
				}
			}
		);
	}, [
		setIsLoadMoreLatestTeachings,
		setLatestTeachings,
		setLatestTeachingsPagination
	]);

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
					contentContainerStyle={{ flexGrow: 1 }}
					showsVerticalScrollIndicator={false}
					alwaysBounceVertical
					onScroll={(event) => {
						if (isNearScrollEnd(event)) {
							void handleLoadMore();
						}
					}}
					scrollEventThrottle={400}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							tintColor={colors.black}
							colors={[colors.black]}
						/>
					}
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
								{isLoadMoreLatestTeachings && (
									<LoadingSpinner label="Loading more teachings..." />
								)}
							</View>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</ImageBackground>
	);
}
