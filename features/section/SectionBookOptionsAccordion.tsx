import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useFilterBook from "@/hooks/useFilterBook";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Accordion, Square } from "tamagui";

const SectionBookOptionsAccordion = memo(function SectionBookOptionsAccordion({
	book,
	totalChapters
}: {
	book: DropdownOptions;
	totalChapters: number;
}) {
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
		<Accordion type="multiple">
			<Accordion.Item value={book.id}>
				<Accordion.Trigger
					style={{
						backgroundColor: colors.black,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					{({ open }: { open: boolean }) => (
						<>
							<Text style={fonts.body1White}>{book.name}</Text>
							<Square
								style={{
									transform: open
										? "rotate(180deg)"
										: "rotate(0deg)",
									transition: "300ms",
									backgroundColor: "transparent"
								}}
							>
								<Image
									source={require("@/assets/icons/chevron_Down.svg")}
									style={{ width: 32, height: 32 }}
								/>
							</Square>
						</>
					)}
				</Accordion.Trigger>
				<Accordion.HeightAnimator>
					<Accordion.Content
						style={{
							backgroundColor: colors.black,
							paddingTop: 0
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
									<Text style={fonts.body1White}>
										{chapter}
									</Text>
								</Pressable>
							))}
						</View>
					</Accordion.Content>
				</Accordion.HeightAnimator>
			</Accordion.Item>
		</Accordion>
	);
});

export default SectionBookOptionsAccordion;
