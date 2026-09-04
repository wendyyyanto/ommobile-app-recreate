import TeachingCard from "@/components/ui/TeachingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import TeachingPageSkeleton from "@/features/skeletons/TeachingPageSkeleton";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { appendUniqueItems, isNearScrollEnd } from "@/utils/paginationHelper";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MotiView } from "moti";
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

const Teachings = () => {
	const {
		setIsLoadingPopularTeachings,
		popularTeachings,
		isLoadingPopularTeachings,
		setPopularTeachings,
		isLoadMorePopularTeachings,
		setIsLoadMorePopularTeachings,
		setPopularTeachingsPagination
	} = useTeachingStore();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const isRefreshingRef = useRef(false);

	const fetchPopularTeachings = useCallback(
		async (isRefresh = false) => {
			setIsLoadMorePopularTeachings(false);

			if (isRefresh) {
				isRefreshingRef.current = true;
				setIsRefreshing(true);
			} else {
				setIsLoadingPopularTeachings(true);
			}

			await getTeachings(
				{ page: 1, limit: TEACHINGS_PAGE_SIZE },
				{
					onSuccess: (data) => {
						setPopularTeachings(data.data);
						setPopularTeachingsPagination(data.pagination);
					},
					onError: (error) => {
						console.log(error);
					},
					onFulfilled: () => {
						if (isRefresh) {
							isRefreshingRef.current = false;
							setIsRefreshing(false);
						} else {
							setIsLoadingPopularTeachings(false);
						}
					}
				}
			);
		},
		[
			setIsLoadMorePopularTeachings,
			setIsLoadingPopularTeachings,
			setPopularTeachings,
			setPopularTeachingsPagination
		]
	);

	useEffect(() => {
		void fetchPopularTeachings();
	}, [fetchPopularTeachings]);

	const handleRefresh = useCallback(() => {
		void fetchPopularTeachings(true);
	}, [fetchPopularTeachings]);

	const handleLoadMore = useCallback(async () => {
		if (isRefreshingRef.current) return;

		const {
			isLoadMorePopularTeachings,
			isLoadingPopularTeachings,
			popularTeachingsPagination
		} = useTeachingStore.getState();

		if (
			isLoadMorePopularTeachings ||
			isLoadingPopularTeachings ||
			popularTeachingsPagination.page >=
				popularTeachingsPagination.totalPages
		) {
			return;
		}

		setIsLoadMorePopularTeachings(true);

		await getTeachings(
			{
				page: popularTeachingsPagination.page + 1,
				limit: TEACHINGS_PAGE_SIZE
			},
			{
				onSuccess: (data) => {
					const state = useTeachingStore.getState();

					if (!state.isLoadMorePopularTeachings) return;

					setPopularTeachings(
						appendUniqueItems(state.popularTeachings, data.data)
					);
					setPopularTeachingsPagination(data.pagination);
				},
				onError: (error) => {
					console.log(error);
				},
				onFulfilled: () => {
					setIsLoadMorePopularTeachings(false);
				}
			}
		);
	}, [
		setIsLoadMorePopularTeachings,
		setPopularTeachings,
		setPopularTeachingsPagination
	]);

	const teachingCategories = [
		{ name: "New Testament", id: "new-testament" },
		{ name: "Topical", id: "topical" },
		{ name: "Old Testament", id: "old-testament" },
		{ name: "Workshop", id: "workshop" }
	];

	if (isLoadingPopularTeachings) return <TeachingPageSkeleton />;

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top"]} className="flex-1">
				<MotiView
					transition={{ type: "spring" }}
					className="flex-1 px-4 font-poppins"
				>
					<View className="flex-row justify-between items-start mb-6">
						<Text className="text-3xl w-2/5 text-white font-poppins">
							Bible Teachings
						</Text>
						<Pressable
							className="rounded-full px-5 py-5 bg-slate-gray"
							onPress={() => router.push("/teachings/search")}
						>
							<Image
								source={require("@/assets/icons/search_icon.svg")}
								style={{ width: 14, height: 14 }}
							/>
						</Pressable>
					</View>
					<View className="flex flex-row flex-wrap gap-2 mb-11">
						{teachingCategories.map((category) => (
							<Pressable
								key={category.id}
								className="basis-[48%] flex-1 flex-row justify-between items-center p-4 rounded-full bg-transparent border border-slate-gray-blue"
								onPress={() =>
									router.push(
										`/teachings/section/${category.id}?name=${category.name}`
									)
								}
							>
								<Text
									style={fonts.body1White}
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{category.name}
								</Text>
								<Image
									source={require("@/assets/icons/chevron_right.svg")}
									style={{
										width: 28,
										height: 28,
										marginRight: -6
									}}
								/>
							</Pressable>
						))}
					</View>

					<View className="flex-1 gap-4">
						<Text style={fonts.subtitle1White}>
							Popular Teachings
						</Text>
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
							<View className="flex flex-1 flex-col gap-4">
								{popularTeachings?.length > 0 &&
									popularTeachings?.map((teaching) => (
										<TeachingCard
											key={teaching.id}
											teaching={teaching}
										/>
									))}
								{isLoadMorePopularTeachings && (
									<LoadingSpinner label="Loading more teachings..." />
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
