import ErrorState from "@/components/ui/ErrorState";
import PressableScale from "@/components/ui/PressableScale";
import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { CONTENT_FADE } from "@/constants/motion";
import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { TeachingListSkeleton } from "@/features/skeletons/ContentSkeletons";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { Pagination } from "@/types/request";
import { Teaching } from "@/types/teaching";
import { showErrorToast } from "@/utils/toastHelper";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MotiView } from "moti";
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

	const teachingCategories = [
		{
			name: "New Testament",
			id: "new-testament",
			background: "#1B3550",
			border: colors.steelBlue
		},
		{
			name: "Old Testament",
			id: "old-testament",
			background: "#1D3B38",
			border: "#3F8F84"
		},
		{
			name: "Topical",
			id: "topical",
			background: "#34264A",
			border: "#8A6BB0"
		}
	];

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top"]} className="flex-1 mt-6">
				<MotiView
					transition={{ type: "spring" }}
					className="flex-1 px-4 font-poppins"
				>
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
					<View className="flex-row gap-2 mb-11">
						{teachingCategories.map((category) => (
							<PressableScale
								key={category.id}
								accessibilityRole="button"
								className="flex-1 min-h-[84px] justify-between p-2.5 rounded-2xl border"
								style={{
									backgroundColor: category.background,
									borderColor: category.border
								}}
								onPress={() =>
									router.push(
										`/teachings/section/${category.id}?name=${category.name}`
									)
								}
							>
								<Text style={fonts.caption2White} numberOfLines={2}>
									{category.name}
								</Text>
								<Image
									source={require("@/assets/icons/chevron_right.svg")}
									style={{
										width: 24,
										height: 24,
										alignSelf: "flex-end",
										marginRight: -4,
										marginBottom: -4
									}}
								/>
							</PressableScale>
						))}
					</View>

					<View className="flex-1 gap-4">
						<Text style={fonts.subtitle1White}>
							Random Teachings
						</Text>
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
							<View className="flex flex-1 flex-col gap-4">
								{isLoadingPopularTeachings && (
									<TeachingListSkeleton count={5} />
								)}
								{!isLoadingPopularTeachings &&
									popularTeachings?.length > 0 && (
										<Animated.View
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
				</MotiView>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default Teachings;
