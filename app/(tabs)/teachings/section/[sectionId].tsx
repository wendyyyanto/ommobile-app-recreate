import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TeachingCard from "@/components/ui/TeachingCard";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import SectionBookFilterDropdown from "@/features/section/SectionBookFilterDropdown";
import SectionOtherFilterDropdown from "@/features/section/SectionOtherFilterDropdown";
import useTeachingSection from "@/hooks/useTeachingSection";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
	ImageBackground,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const TeachingsSection = () => {
	const { name: sectionName, sectionId } = useLocalSearchParams();
	const { isLoadingSectionTeachings, sectionTeachings } = useTeachingStore();
	const { setIsFilterByBookOpen, setIsFilterByOtherOpen } =
		useTeachingFilterStore();
	const { handleCloseSectionTeachings } = useTeachingSection({
		sectionName: sectionName as string
	});

	if (isLoadingSectionTeachings && sectionTeachings.length === 0) {
		return <LoadingSpinner />;
	}

	return (
		<ImageBackground source={backgroundImage} className="flex-1">
			<SafeAreaView edges={["top", "bottom"]} className="flex-1 gap-7">
				<View className="px-4 flex flex-row justify-between items-start">
					<View className="flex justify-start items-start gap-4">
						<BackButton onPress={handleCloseSectionTeachings} />
						<Text className="text-3xl text-wrap text-white font-poppins">
							{(sectionName as string).split(" ").join("\n")}
						</Text>
					</View>

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

				<View className="px-4 flex flex-row gap-4">
					{(sectionId === "new-testament" ||
						sectionId === "old-testament") && (
						<Pressable
							style={styles.filterButton}
							onPress={() => {
								setIsFilterByBookOpen(true);
								setIsFilterByOtherOpen(false);
							}}
						>
							<Text className="text-white font-poppins">
								All Books
							</Text>
							<Image
								source={require("@/assets/icons/chevron_Down.svg")}
								style={{ width: 32, height: 32 }}
							/>
						</Pressable>
					)}
					<Pressable
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
						<Image
							source={require("@/assets/icons/chevron_Down.svg")}
							style={{ width: 32, height: 32 }}
						/>
					</Pressable>
				</View>

				<View className="px-4 flex-1 gap-3">
					<Text style={fonts.subtitle1White}>Latest Teachings</Text>
					<ScrollView
						showsVerticalScrollIndicator={false}
						className="flex-1"
					>
						<View className="flex-1 gap-4 relative">
							{isLoadingSectionTeachings ? (
								<LoadingSpinner />
							) : sectionTeachings?.length > 0 ? (
								sectionTeachings?.map((teaching) => (
									<TeachingCard
										key={teaching.id}
										teaching={teaching}
									/>
								))
							) : (
								<View className="flex-1 justify-center items-center">
									<Text style={fonts.caption1White}>
										No teachings found
									</Text>
								</View>
							)}
						</View>
					</ScrollView>

					<SectionBookFilterDropdown />
					<SectionOtherFilterDropdown />
				</View>
			</SafeAreaView>
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
