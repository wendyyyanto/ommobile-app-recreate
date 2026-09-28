import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useFilterBook from "@/hooks/useFilterBook";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import { Image } from "expo-image";
import { memo, useMemo, useState } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from "react-native-reanimated";

const SectionBookOptionsAccordion = memo(function SectionBookOptionsAccordion({
	book,
	totalChapters
}: {
	book: DropdownOptions;
	totalChapters: number;
}) {
	const [open, setOpen] = useState(false);
	const rotation = useSharedValue(0);

	const selectedBookEntry = useTeachingFilterStore((state) =>
		state.selectedBook?.bookName === book.name ? state.selectedBook : null
	);
	const { handleChapterPress } = useFilterBook();

	const selectedChapterSet = useMemo(
		() => new Set(selectedBookEntry?.chapters ?? []),
		[selectedBookEntry]
	);

	const chapterNumbers = useMemo(
		() => Array.from({ length: totalChapters }, (_, index) => index + 1),
		[totalChapters]
	);

	const chevronStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }]
	}));

	const toggle = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		const next = !open;
		setOpen(next);
		rotation.value = withTiming(next ? 180 : 0, { duration: 300 });
	};

	return (
		<View className="px-4">
			<Pressable
				onPress={toggle}
				style={{
					backgroundColor: colors.black,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingVertical: 12
				}}
			>
				<Text style={fonts.body1White}>{book.name}</Text>
				<Animated.View style={chevronStyle}>
					<Image
						source={require("@/assets/icons/chevron_Down.svg")}
						style={{ width: 32, height: 32 }}
					/>
				</Animated.View>
			</Pressable>

			{open && (
				<View
					style={{
						backgroundColor: colors.black,
						paddingBottom: 12
					}}
				>
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							gap: 12
						}}
					>
						{chapterNumbers.map((chapter) => (
							<Pressable
								key={chapter}
								style={{
									flexBasis: "16.66%",
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 8,
									backgroundColor: selectedChapterSet.has(
										chapter
									)
										? colors.slateGray
										: colors.darkerGray,
									paddingVertical: 16
								}}
								onPress={() => {
									handleChapterPress(book.name, chapter);
								}}
							>
								<Text style={fonts.body1White}>{chapter}</Text>
							</Pressable>
						))}
					</View>
				</View>
			)}
		</View>
	);
});

export default SectionBookOptionsAccordion;
