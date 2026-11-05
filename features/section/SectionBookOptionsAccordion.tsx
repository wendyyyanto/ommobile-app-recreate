import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import {
	BACKGROUND_TRANSITION,
	QUICK_FADE,
	QUICK_FADE_OUT,
	ROTATE_TRANSITION,
	ROW_LAYOUT
} from "@/constants/motion";
import useFilterBook from "@/hooks/useFilterBook";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { memo, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SectionBookOptionsAccordion = memo(function SectionBookOptionsAccordion({
	book,
	totalChapters
}: {
	book: DropdownOptions;
	totalChapters: number;
}) {
	const [open, setOpen] = useState(false);
	const reduced = useReducedMotion();

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

	return (
		<Animated.View
			layout={ROW_LAYOUT}
			style={{ paddingHorizontal: 16, overflow: "hidden" }}
		>
			<Pressable
				onPress={() => setOpen((isOpen) => !isOpen)}
				style={{
					backgroundColor: colors.black,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingVertical: 12
				}}
			>
				<Text style={fonts.body1White}>{book.name}</Text>
				<Animated.View
					style={[
						!reduced && ROTATE_TRANSITION,
						{ transform: [{ rotate: open ? "180deg" : "0deg" }] }
					]}
				>
					<Image
						source={require("@/assets/icons/chevron_Down.svg")}
						style={{ width: 32, height: 32 }}
					/>
				</Animated.View>
			</Pressable>

			{open && (
				<Animated.View
					entering={QUICK_FADE}
					exiting={QUICK_FADE_OUT}
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
							<AnimatedPressable
								key={chapter}
								style={[
									BACKGROUND_TRANSITION,
									{
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
									}
								]}
								onPress={() => {
									void Haptics.selectionAsync();
									handleChapterPress(book.name, chapter);
								}}
							>
								<Text style={fonts.body1White}>{chapter}</Text>
							</AnimatedPressable>
						))}
					</View>
				</Animated.View>
			)}
		</Animated.View>
	);
});

export default SectionBookOptionsAccordion;
