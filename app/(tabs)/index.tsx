import ErrorState from "@/components/ui/ErrorState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PressableScale from "@/components/ui/PressableScale";
import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { CONTENT_FADE } from "@/constants/motion";
import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { annoucementBanners } from "@/constants/placeholders";
import AnnouncementCarousel from "@/features/home/AnnouncementCarousel";
import {
	SkeletonLine,
	TeachingListSkeleton
} from "@/features/skeletons/ContentSkeletons";
import { getProfile } from "@/services/authServices";
import { getNotifications } from "@/services/notificationServices";
import { getTeachings } from "@/services/teachingServices";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { useAuthStore } from "@/stores/authStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { Notification } from "@/types/notification";
import { showErrorToast } from "@/utils/toastHelper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ImageBackground,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

const backgroundImage = require("@/assets/images/background.webp");

export default function Index() {
	const { token, profile, setProfile } = useAuthStore(
		useShallow((s) => ({
			token: s.token,
			profile: s.profile,
			setProfile: s.setProfile
		}))
	);

	const {
		setIsLoadingLatestTeachings,
		setLatestTeachings,
		latestTeachings,
		isLoadingLatestTeachings,
		isLoadMoreLatestTeachings
	} = useTeachingStore(
		useShallow((s) => ({
			setIsLoadingLatestTeachings: s.setIsLoadingLatestTeachings,
			setLatestTeachings: s.setLatestTeachings,
			latestTeachings: s.latestTeachings,
			isLoadingLatestTeachings: s.isLoadingLatestTeachings,
			isLoadMoreLatestTeachings: s.isLoadMoreLatestTeachings
		}))
	);
	const setAnnouncementList = useAnnouncementStore(
		(s) => s.setAnnouncementList
	);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [hasError, setHasError] = useState(false);

	const fetchHomeData = useCallback(
		async (isRefresh = false) => {
			setHasError(false);
			if (isRefresh) {
				setIsRefreshing(true);
			} else {
				setIsLoadingLatestTeachings(true);
			}

			await Promise.all([
				getTeachings(
					{
						page: 1,
						limit: TEACHINGS_PAGE_SIZE,
						year: [String(new Date().getFullYear())]
					},
					{
						onSuccess: (data) => {
							setLatestTeachings(data.data);
						},
						onError: (error) => {
							console.log(error);
							setHasError(true);
							if (useTeachingStore.getState().latestTeachings.length > 0) {
								showErrorToast("Couldn't refresh. Please try again.");
							}
						}
					}
				),
				getProfile(token ?? "", {
					onSuccess: setProfile,
					onError: (error) => {
						console.log(error);
					}
				}),
				getNotifications("", {
					onSuccess: ({ data }: { data: Notification[] }) => {
						const banners = data
							.filter((item) => item.thumbnail)
							.map((item) => ({
								id: item.id,
								announcementTitle: item.title,
								bannerUrl: item.thumbnail!.url
							}));
						setAnnouncementList(
							banners.length ? banners : annoucementBanners
						);
					},
					onError: (error) => {
						console.log(error);
					}
				})
			]);

			if (isRefresh) {
				setIsRefreshing(false);
			} else {
				setIsLoadingLatestTeachings(false);
			}
		},
		[
			token,
			setProfile,
			setAnnouncementList,
			setIsLoadingLatestTeachings,
			setLatestTeachings
		]
	);

	useEffect(() => {
		void fetchHomeData();
	}, [fetchHomeData]);

	const handleRefresh = useCallback(() => {
		void fetchHomeData(true);
	}, [fetchHomeData]);

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
								{isLoadingLatestTeachings && !profile ? (
									<SkeletonLine
										font={{
											fontSize: 30,
											lineHeight: 36,
											fontFamily: "Poppins_400Regular"
										}}
										width="45%"
									/>
								) : (
									<Text className="font-poppins text-white w-1/2 text-3xl">
										{profile?.name}
									</Text>
								)}
							</View>
							<Pressable
								hitSlop={12}
								accessibilityRole="button"
								accessibilityLabel="Settings"
								className="z-10 active:opacity-70"
								onPress={() => router.push("/settings")}
							>
								<Ionicons
									name="settings-outline"
									size={24}
									color="white"
								/>
							</Pressable>
						</View>

						<AnnouncementCarousel isLoading={isLoadingLatestTeachings} />

						<View className="flex flex-col gap-4">
							<Text style={fonts.subtitle1White}>Resources</Text>
							<View className="flex flex-row gap-3">
								<PressableScale
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
								</PressableScale>
								<PressableScale
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
								</PressableScale>
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
								<PressableScale
									className="bg-charcoal-blue rounded-full py-2 w-1/4"
									onPress={() => router.push("/teachings")}
								>
									<Text
										style={[
											fonts.caption2White,
											{
												color: "rgba(255, 255, 255, 0.7)"
											}
										]}
										className="text-center"
									>
										Browse All
									</Text>
								</PressableScale>
							</View>
							<View className="flex flex-1 gap-4">
								{isLoadingLatestTeachings && (
									<TeachingListSkeleton count={4} />
								)}
								{!isLoadingLatestTeachings &&
									latestTeachings?.length > 0 && (
										<Animated.View
											entering={CONTENT_FADE}
											style={{ gap: 16 }}
										>
											{latestTeachings.map((teaching) => (
												<TeachingCard
													key={teaching.id}
													teaching={teaching}
												/>
											))}
										</Animated.View>
									)}
								{hasError && latestTeachings?.length === 0 && (
									<View className="py-10">
										<ErrorState
											message="Couldn't load teachings. Check your connection and try again."
											onRetry={handleRefresh}
										/>
									</View>
								)}
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
