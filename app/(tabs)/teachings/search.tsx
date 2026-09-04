import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useSearchTeachings from "@/hooks/useSearchTeachings";
import { useTeachingStore } from "@/stores/teachingStore";
import { isNearScrollEnd } from "@/utils/paginationHelper";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef } from "react";
import {
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchTeaching = () => {
	const {
		searchTeachings,
		isLoadingSearchTeachings,
		searchQuery,
		setSearchQuery,
		setSearchTeachings,
		isLoadMoreSearchTeachings
	} = useTeachingStore();
	const { handleSearchTeachings, handleLoadMoreSearchTeachings } =
		useSearchTeachings();
	const searchInputRef = useRef<TextInput>(null);

	const backgroundImage =
		searchQuery.trim() !== "" && searchTeachings?.length === 0
			? require("@/assets/images/search_noresult.png")
			: require("@/assets/images/search_initial.png");

	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="contain"
		>
			<SafeAreaView
				edges={["top", "bottom"]}
				className="flex-1 px-4 gap-7"
			>
				<View className="flex flex-row justify-start items-center gap-4">
					<BackButton
						onPress={() => {
							setSearchQuery("");
							setSearchTeachings([]);
							router.back();
						}}
					/>
					<Text style={fonts.body2White}>Search</Text>
				</View>
				<Pressable
					className="flex-row items-center gap-2 py-2"
					style={{
						borderBottomWidth: 0.5,
						borderColor: colors.lightSteelGray
					}}
					onPress={() => searchInputRef.current?.focus()}
				>
					<Image
						source={require("@/assets/icons/search_icon.svg")}
						style={{ width: 14, height: 14 }}
					/>
					<TextInput
						ref={searchInputRef}
						placeholder="Search teachings..."
						placeholderTextColor={colors.lightSteelGray}
						style={[fonts.body1White, { flex: 1 }]}
						textAlignVertical="center"
						onChangeText={handleSearchTeachings}
					/>
				</Pressable>

				{isLoadingSearchTeachings ? (
					<View className="flex-1 justify-center items-center">
						<LoadingSpinner
							label={`Searching for "${searchQuery}"...`}
						/>
					</View>
				) : searchTeachings?.length > 0 ? (
					<ScrollView
						showsVerticalScrollIndicator={false}
						onScroll={(event) => {
							if (isNearScrollEnd(event)) {
								void handleLoadMoreSearchTeachings();
							}
						}}
						scrollEventThrottle={400}
					>
						<View className="flex-1 gap-4">
							{searchTeachings?.map((teaching) => (
								<TeachingCard
									key={teaching.id}
									teaching={teaching}
								/>
							))}
							{isLoadMoreSearchTeachings && (
								<LoadingSpinner label="Loading more teachings..." />
							)}
						</View>
					</ScrollView>
				) : (
					<View className="flex-1 items-center justify-center">
						<Text
							style={[
								fonts.body1White,
								{
									opacity: 0.7,
									textAlign: "center",
									width: "80%"
								}
							]}
						>
							{searchQuery.trim() === "" &&
							searchTeachings?.length === 0
								? "Search teaching by books, title, verses, teachers, or keywords.."
								: `Couldn't find "${searchQuery}" Please try another keywords`}
						</Text>
					</View>
				)}
			</SafeAreaView>
		</ImageBackground>
	);
};

export default SearchTeaching;
