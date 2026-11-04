import PressableScale from "@/components/ui/PressableScale";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useFilterBook from "@/hooks/useFilterBook";
import { getDropdowns } from "@/services/dropdownServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import BottomSheet, {
	BottomSheetFooterProps,
	BottomSheetScrollView
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	FILTER_FOOTER_SPACE,
	FILTER_OPEN_INDEX,
	FILTER_SNAP_POINTS,
	FilterSheetBackdrop,
	FilterSheetFooter
} from "./FilterSheetParts";
import SectionBookOptionsAccordion from "./SectionBookOptionsAccordion";
import { useShallow } from "zustand/react/shallow";

const BookFilterFooter = (props: BottomSheetFooterProps) => {
	const { selectedBook, setIsFilterByBookOpen, setSelectedBook } =
		useTeachingFilterStore(
			useShallow((s) => ({
				selectedBook: s.selectedBook,
				setIsFilterByBookOpen: s.setIsFilterByBookOpen,
				setSelectedBook: s.setSelectedBook
			}))
		);
	const { handleFilterTeachingByBook } = useFilterBook();

	return (
		<FilterSheetFooter {...props} visible={Boolean(selectedBook)}>
			{selectedBook && (
				<>
					<PressableScale
						className="flex-1"
						onPress={() => setSelectedBook(null)}
					>
						<Text
							style={[
								fonts.body1White,
								{ color: colors.lightBlue, textAlign: "center" }
							]}
						>
							Reset Selections
						</Text>
					</PressableScale>
					<PressableScale
						className="bg-white rounded-full p-4 flex-row flex-1 items-center justify-center"
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
					</PressableScale>
				</>
			)}
		</FilterSheetFooter>
	);
};

const SectionBookFilterDropdown = () => {
	const {
		bookOptions,
		bookChapters,
		setIsFilterByBookOpen,
		setBookOptions,
		setBookChapters,
		isFilterByBookOpen
	} = useTeachingFilterStore(
		useShallow((s) => ({
			bookOptions: s.bookOptions,
			bookChapters: s.bookChapters,
			setIsFilterByBookOpen: s.setIsFilterByBookOpen,
			setBookOptions: s.setBookOptions,
			setBookChapters: s.setBookChapters,
			isFilterByBookOpen: s.isFilterByBookOpen
		}))
	);

	const { name } = useLocalSearchParams<{ name?: string | string[] }>();
	const sectionName = Array.isArray(name) ? name[0] : name;

	const bottomSheetRef = useRef<BottomSheet>(null);
	const insets = useSafeAreaInsets();

	useEffect(() => {
		getDropdowns(
			{
				entity: "books",
				attributes: ["id", "bookName"],
				filters: sectionName?.endsWith("Testament")
					? [{ key: "testament", operator: "eq", value: sectionName }]
					: undefined,
				sort_by: [["id", "asc"]]
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
	}, [sectionName, setBookOptions, setBookChapters]);

	useEffect(() => {
		if (isFilterByBookOpen) {
			bottomSheetRef.current?.snapToIndex(FILTER_OPEN_INDEX);
		} else {
			bottomSheetRef.current?.close();
		}
	}, [isFilterByBookOpen]);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isFilterByBookOpen ? FILTER_OPEN_INDEX : -1}
			snapPoints={FILTER_SNAP_POINTS}
			enableDynamicSizing={false}
			enablePanDownToClose
			topInset={insets.top}
			backdropComponent={FilterSheetBackdrop}
			footerComponent={BookFilterFooter}
			onClose={() => setIsFilterByBookOpen(false)}
			handleIndicatorStyle={{ backgroundColor: colors.slateGray }}
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
				<PressableScale onPress={() => setIsFilterByBookOpen(false)}>
					<Image
						source={require("@/assets/icons/close.svg")}
						style={{ width: 40, height: 40 }}
					/>
				</PressableScale>
			</View>
			<BottomSheetScrollView
				contentContainerStyle={{
					paddingBottom: FILTER_FOOTER_SPACE + insets.bottom
				}}
			>
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
		</BottomSheet>
	);
};

export default SectionBookFilterDropdown;
