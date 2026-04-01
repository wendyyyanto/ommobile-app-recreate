import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useFilterBook from "@/hooks/useFilterBook";
import { getDropdowns } from "@/services/dropdownServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import SectionBookOptionsAccordion from "./SectionBookOptionsAccordion";

const SectionBookFilterDropdown = () => {
	const {
		bookOptions,
		bookChapters,
		selectedBook,
		setIsFilterByBookOpen,
		setBookOptions,
		setBookChapters,
		isFilterByBookOpen
	} = useTeachingFilterStore();

	const { handleSelectAllChapters, handleFilterTeachingByBook } =
		useFilterBook();

	const bottomSheetRef = useRef<BottomSheet>(null);

	useEffect(() => {
		getDropdowns(
			{
				entity: "books",
				attributes: ["id", "bookName"]
			},
			{
				onSuccess: (data) => {
					setBookOptions(data.data);
				},
				onError: (error) => {
					console.log(error);
				}
			}
		);

		getDropdowns(
			{
				entity: "books",
				attributes: ["bookName", "totalChapters"]
			},
			{
				onSuccess: (data) => {
					setBookChapters(data.data);
				},
				onError: (error) => {
					console.log(error);
				}
			}
		);
	}, [setBookOptions, setBookChapters]);

	useEffect(() => {
		if (isFilterByBookOpen) {
			bottomSheetRef.current?.expand();
		} else {
			bottomSheetRef.current?.close();
		}
	}, [isFilterByBookOpen]);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isFilterByBookOpen ? 0 : -1}
			snapPoints={["50%", "80%", "100%"]}
			enablePanDownToClose
			onClose={() => setIsFilterByBookOpen(false)}
			handleIndicatorStyle={{ display: "none" }}
			backgroundStyle={{
				backgroundColor: colors.black,
				borderRadius: 20
			}}
		>
			<View className="px-4 flex flex-row justify-between items-center">
				<Text
					style={[fonts.body1White, { color: colors.lightBlue }]}
				></Text>
				<Text style={[fonts.subtitle1White]}>Books</Text>
				<Pressable onPress={() => setIsFilterByBookOpen(false)}>
					<Image
						source={require("@/assets/icons/close.svg")}
						style={{ width: 40, height: 40 }}
					/>
				</Pressable>
			</View>
			<BottomSheetScrollView>
				{bookOptions?.length > 0 &&
					bookOptions?.map((book) => {
						const totalChapters =
							bookChapters.length > 0 &&
							bookChapters?.find(
								(chapter) => chapter.id === book.name
							)?.name;

						return (
							<SectionBookOptionsAccordion
								key={book.id}
								book={book}
								totalChapters={Number(totalChapters)}
							/>
						);
					})}
			</BottomSheetScrollView>

			{selectedBook && (
				<View className="sticky bottom-0 left-0 right-0 justify-center items-center flex-row bg-black py-4 gap-10">
					<Pressable
						onPress={() => {
							const totalChapters =
								bookChapters.length > 0 &&
								bookChapters?.find(
									(chapter) =>
										chapter.id === selectedBook.bookName
								)?.name;

							return handleSelectAllChapters(
								Number(totalChapters)
							);
						}}
					>
						<Text
							style={[
								fonts.body1White,
								{ color: colors.lightBlue, textAlign: "center" }
							]}
						>
							Select All Chapters
						</Text>
					</Pressable>
					<Pressable
						className="bg-white rounded-full p-4 flex-row items-center justify-center"
						onPress={(e) => {
							e.preventDefault();
							setIsFilterByBookOpen(false);
							handleFilterTeachingByBook(
								selectedBook.bookName,
								selectedBook.chapters
							);
						}}
					>
						<Text
							style={[
								fonts.body1White,
								{ color: colors.black, textAlign: "center" }
							]}
						>
							Show {selectedBook.bookName.slice(0, 3)}{" "}
							{selectedBook.chapters.length === 1
								? selectedBook.chapters[0]
								: `${selectedBook.chapters[0]} - ${
										selectedBook.chapters[
											selectedBook.chapters.length - 1
										]
									}`}
						</Text>
						<Image
							source={require("@/assets/icons/chevron_right.svg")}
							tintColor={colors.black}
							style={{
								width: 24,
								height: 24
							}}
						/>
					</Pressable>
				</View>
			)}
		</BottomSheet>
	);
};

export default SectionBookFilterDropdown;
