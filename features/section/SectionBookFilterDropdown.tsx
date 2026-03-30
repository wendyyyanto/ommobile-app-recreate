import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { getDropdowns } from "@/services/dropdownServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import SectionBookOptionsAccordion from "./SectionBookOptionsAccordion";

const SectionBookFilterDropdown = () => {
	const {
		isFilterByBookOpen,
		bookOptions,
		setIsFilterByBookOpen,
		setBookOptions
	} = useTeachingFilterStore();

	const bottomSheetRef = useRef<BottomSheet>(null);

	const [chapters, setChapters] = useState<DropdownOptions[]>([]);

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
					setChapters(data.data);
				},
				onError: (error) => {
					console.log(error);
				}
			}
		);

		return () => {};
	}, []);

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
				<Pressable onPress={() => bottomSheetRef.current?.close()}>
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
							chapters.length > 0 &&
							chapters?.find(
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
