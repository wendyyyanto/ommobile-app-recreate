import { TAB_BAR_SPACE } from "@/components/ui/FloatingTabBar";
import ErrorState from "@/components/ui/ErrorState";
import PressableScale from "@/components/ui/PressableScale";
import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { CONTENT_FADE } from "@/constants/motion";
import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { TeachingListSkeleton } from "@/features/skeletons/ContentSkeletons";
import TeachingCategoryBento from "@/features/teaching/TeachingCategoryBento";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { Pagination } from "@/types/request";
import { Teaching } from "@/types/teaching";
import { showErrorToast } from "@/utils/toastHelper";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ImageBackground,
	RefreshControl,
	ScrollView,
	Text,
	View
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

const backgroundImage = require("@/assets/images/background.webp");

type TeachingPage = {
	data: Teaching[];
	pagination: Pagination;
};

const fetchTeachingPage = (page: number) =>
	new Promise<TeachingPage>((resolve, reject) => {
		void getTeachings(
			{ page, limit: TEACHINGS_PAGE_SIZE },
			{
				onSuccess: resolve,
				onError: reject
			}
		);
	});

const Teachings = () => {
	const {
		setIsLoadingPopularTeachings,
		popularTeachings,
		isLoadingPopularTeachings,
		setPopularTeachings
	} = useTeachingStore(
		useShallow((s) => ({
			setIsLoadingPopularTeachings: s.setIsLoadingPopularTeachings,
			popularTeachings: s.popularTeachings,
			isLoadingPopularTeachings: s.isLoadingPopularTeachings,
			setPopularTeachings: s.setPopularTeachings
		}))
	);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [hasError, setHasError] = useState(false);
	const isRefreshingRef = useRef(false);
	const totalPagesRef = useRef<number | null>(null);

	const fetchPopularTeachings = useCallback(
		async (isRefresh = false) => {
			setHasError(false);
			if (isRefresh) {
				isRefreshingRef.current = true;
				setIsRefreshing(true);
			} else {
				setIsLoadingPopularTeachings(true);
			}

			try {
				let selectedPage: TeachingPage | null = null;

				if (totalPagesRef.current === null) {
					selectedPage = await fetchTeachingPage(1);
					totalPagesRef.current = Math.max(
						1,
						selectedPage.pagination.total_pages
					);
				}

				const randomPage =
					Math.floor(Math.random() * totalPagesRef.current) + 1;

				if (randomPage !== 1 || selectedPage === null) {
					selectedPage = await fetchTeachingPage(randomPage);
				}

				totalPagesRef.current = Math.max(
					1,
					selectedPage.pagination.total_pages
				);
				setPopularTeachings(
					selectedPage.data.slice(0, TEACHINGS_PAGE_SIZE)
				);
			} catch (error) {
				console.log(error);
				setHasError(true);
				if (useTeachingStore.getState().popularTeachings.length > 0) {
					showErrorToast("Couldn't refresh. Please try again.");
				}
			} finally {
				if (isRefresh) {
					isRefreshingRef.current = false;
					setIsRefreshing(false);
				} else {
					setIsLoadingPopularTeachings(false);
				}
			}
		},
		[setIsLoadingPopularTeachings, setPopularTeachings]
	);

	useEffect(() => {
		void fetchPopularTeachings();
	}, [fetchPopularTeachings]);

	const handleRefresh = useCallback(() => {
		void fetchPopularTeachings(true);
	}, [fetchPopularTeachings]);

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top"]} className="flex-1 mt-6">
				<View className="flex-1 px-4 font-poppins">
					<View className="flex-row justify-between items-start mb-6">
						<Text className="text-3xl w-2/5 text-white font-poppins">
							Bible Teachings
						</Text>
						<PressableScale
							accessibilityRole="button"
							accessibilityLabel="Search teachings"
							className="rounded-full px-5 py-5 bg-slate-gray"
							onPress={() => router.push("/teachings/search")}
						>
							<Image
								source={require("@/assets/icons/search_icon.svg")}
								style={{ width: 14, height: 14 }}
							/>
						</PressableScale>
					</View>
					<View className="mb-11">
						<TeachingCategoryBento />
					</View>

					<View className="flex-1 gap-4">
						<Text style={fonts.subtitle1White}>
							Random Teachings
						</Text>
						<ScrollView
							className="flex-1"
							contentContainerStyle={{ flexGrow: 1, paddingBottom: TAB_BAR_SPACE }}
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
							<View className="flex flex-1 flex-col gap-4">
								{isLoadingPopularTeachings && (
									<TeachingListSkeleton count={5} />
								)}
								{!isLoadingPopularTeachings &&
									popularTeachings?.length > 0 && (
										<Animated.View
											key={popularTeachings[0].id}
											entering={CONTENT_FADE}
											style={{ gap: 16 }}
										>
											{popularTeachings.map((teaching) => (
												<TeachingCard
													key={teaching.id}
													teaching={teaching}
												/>
											))}
										</Animated.View>
									)}
								{hasError && popularTeachings?.length === 0 && (
									<ErrorState
										message="Couldn't load teachings. Check your connection and try again."
										onRetry={handleRefresh}
									/>
								)}
							</View>
						</ScrollView>
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default Teachings;
