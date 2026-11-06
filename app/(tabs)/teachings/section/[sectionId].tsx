import BackButton from "@/components/ui/BackButton";
import ErrorState from "@/components/ui/ErrorState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PressableScale from "@/components/ui/PressableScale";
import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { CONTENT_FADE, ROTATE_TRANSITION } from "@/constants/motion";
import { TeachingListSkeleton } from "@/features/skeletons/ContentSkeletons";
import SectionBookFilterDropdown from "@/features/section/SectionBookFilterDropdown";
import SectionOtherFilterDropdown from "@/features/section/SectionOtherFilterDropdown";
import useTeachingSection from "@/hooks/useTeachingSection";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
	FlatList,
	ImageBackground,
	RefreshControl,
	StyleSheet,
	Text,
	View
} from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

const backgroundImage = require("@/assets/images/background.webp");

const ItemSeparator = () => <View style={{ height: 16 }} />;

const TeachingsSection = () => {
	const { name, sectionId } = useLocalSearchParams<{
		name?: string;
		sectionId?: string;
	}>();
	const sectionName =
		name ||
		(sectionId ?? "")
			.split("-")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	const {
		isLoadingSectionTeachings,
		sectionTeachings,
		isLoadMoreSectionTeachings
	} = useTeachingStore(
		useShallow((s) => ({
			isLoadingSectionTeachings: s.isLoadingSectionTeachings,
			sectionTeachings: s.sectionTeachings,
			isLoadMoreSectionTeachings: s.isLoadMoreSectionTeachings
		}))
	);
	const {
		isFilterByBookOpen,
		isFilterByOtherOpen,
		setIsFilterByBookOpen,
		setIsFilterByOtherOpen
	} = useTeachingFilterStore(
		useShallow((s) => ({
			isFilterByBookOpen: s.isFilterByBookOpen,
			isFilterByOtherOpen: s.isFilterByOtherOpen,
			setIsFilterByBookOpen: s.setIsFilterByBookOpen,
			setIsFilterByOtherOpen: s.setIsFilterByOtherOpen
		}))
	);
	const reduced = useReducedMotion();
	const {
		hasError,
		handleCloseSectionTeachings,
		handleRefreshSectionTeachings,
		handleLoadMoreSectionTeachings
	} = useTeachingSection({
		sectionName
	});

	return (
		<ImageBackground source={backgroundImage} className="flex-1">
			<SafeAreaView
				edges={["top", "bottom"]}
				className="flex-1 gap-7 mt-6"
			>
				<View className="px-4 flex flex-row justify-between items-start">
					<View className="flex justify-start items-start gap-4">
						<BackButton onPress={handleCloseSectionTeachings} />
						<Text className="text-3xl text-wrap text-white font-poppins">
							{sectionName.split(" ").join("\n")}
						</Text>
					</View>

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

				<View className="px-4 flex flex-row gap-4">
					{(sectionId === "new-testament" ||
						sectionId === "old-testament") && (
						<PressableScale
							style={styles.filterButton}
							onPress={() => {
								setIsFilterByBookOpen(true);
								setIsFilterByOtherOpen(false);
							}}
						>
							<Text className="text-white font-poppins">
								All Books
							</Text>
							<Animated.View
								style={[
									!reduced && ROTATE_TRANSITION,
									{
										transform: [
											{ rotate: isFilterByBookOpen ? "180deg" : "0deg" }
										]
									}
								]}
							>
								<Image
									source={require("@/assets/icons/chevron_Down.svg")}
									style={{ width: 32, height: 32 }}
								/>
							</Animated.View>
						</PressableScale>
					)}
					<PressableScale
						style={styles.filterButton}
						onPress={() => {
							setIsFilterByOtherOpen(true);
							setIsFilterByBookOpen(false);
						}}
					>
						<View className="flex flex-row items-center">
							<Image
								source={require("@/assets/icons/filter.svg")}
								style={{ width: 32, height: 32 }}
							/>
							<Text className="text-white font-poppins">
								Filters
							</Text>
						</View>
						<Animated.View
							style={[
								!reduced && ROTATE_TRANSITION,
								{
									transform: [
										{ rotate: isFilterByOtherOpen ? "180deg" : "0deg" }
									]
								}
							]}
						>
							<Image
								source={require("@/assets/icons/chevron_Down.svg")}
								style={{ width: 32, height: 32 }}
							/>
						</Animated.View>
					</PressableScale>
				</View>

				<View className="px-4 flex-1 gap-3">
					<Text style={fonts.subtitle1White}>Latest Teachings</Text>
					{isLoadingSectionTeachings ? (
						<View className="flex-1">
							<TeachingListSkeleton count={6} />
						</View>
					) : (
					<Animated.View entering={CONTENT_FADE} style={{ flex: 1 }}>
					<FlatList
						data={sectionTeachings}
						keyExtractor={(teaching) => String(teaching.id)}
						renderItem={({ item }) => <TeachingCard teaching={item} />}
						ItemSeparatorComponent={ItemSeparator}
						refreshControl={
							<RefreshControl
								refreshing={false}
								onRefresh={handleRefreshSectionTeachings}
							/>
						}
						showsVerticalScrollIndicator={false}
						className="flex-1"
						contentContainerStyle={{ flexGrow: 1, paddingBottom: 160 }}
						onEndReached={() =>
								sectionTeachings.length > 0 &&
								void handleLoadMoreSectionTeachings()
							}
						onEndReachedThreshold={0.1}
						ListEmptyComponent={
							hasError ? (
								<ErrorState
									message="Couldn't load teachings. Check your connection and try again."
									onRetry={handleRefreshSectionTeachings}
								/>
							) : (
								<View className="flex-1 justify-center items-center">
									<Text style={fonts.caption1White}>No teachings found</Text>
								</View>
							)
						}
						ListFooterComponent={
							isLoadMoreSectionTeachings ? (
								<LoadingSpinner label="Loading more teachings..." />
							) : null
						}
					/>
					</Animated.View>
					)}
				</View>
			</SafeAreaView>
			<SectionBookFilterDropdown />
			<SectionOtherFilterDropdown />
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	filterButton: {
		flex: 1,
		flexBasis: "40%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.slateGrayBlue,
		borderRadius: 100,
		paddingHorizontal: 16,
		paddingVertical: 12
	}
});

export default TeachingsSection;
