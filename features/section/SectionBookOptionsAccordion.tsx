import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useFilterBook from "@/hooks/useFilterBook";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Accordion, Square } from "tamagui";

const SectionBookOptionsAccordion = ({
	book,
	totalChapters
}: {
	book: DropdownOptions;
	totalChapters: number;
}) => {
	const { selectedBook } = useTeachingFilterStore();
	const { handleChapterPress, handleOnAccordionClosed } = useFilterBook();

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
								transparent
								transition="quick"
								rotate={open ? "180deg" : "0deg"}
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
						transition="300ms"
						exitStyle={{ opacity: 0 }}
						style={{
							backgroundColor: colors.black
						}}
					>
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								gap: 12
							}}
						>
							{Array.from({ length: totalChapters }).map(
								(_, index) => (
									<Pressable
										key={index}
										style={{
											flexBasis: "16.66%",
											justifyContent: "center",
											alignItems: "center",
											borderRadius: 8,
											backgroundColor: selectedBook
												.find(
													(item) =>
														item.bookName ===
														book.name
												)
												?.chapters.includes(index + 1)
												? colors.lightBlue
												: colors.darkerGray,
											paddingVertical: 16
										}}
										onPress={() => {
											handleChapterPress(
												book.name,
												index + 1
											);
										}}
									>
										<Text style={fonts.body1White}>
											{index + 1}
										</Text>
									</Pressable>
								)
							)}
						</View>
					</Accordion.Content>
				</Accordion.HeightAnimator>
			</Accordion.Item>
		</Accordion>
	);
};

export default SectionBookOptionsAccordion;
