import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useFilterOther from "@/hooks/useFilterOther";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions, FilterOtherOptions } from "@/types/dropdown";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import SectionOtherOptionsAccordion from "./SectionOtherOptionsAccordion";

const SectionOtherFilterDropdown = () => {
	const { isFilterByOtherOpen, setIsFilterByOtherOpen, filterOtherOptions } =
		useTeachingFilterStore();

	useFilterOther();

	const bottomSheetRef = useRef<BottomSheet>(null);

	useEffect(() => {
		if (isFilterByOtherOpen) {
			bottomSheetRef.current?.expand();
		} else {
			bottomSheetRef.current?.close();
		}
	}, [isFilterByOtherOpen]);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isFilterByOtherOpen ? 0 : -1}
			snapPoints={["50%", "80%", "100%"]}
			enablePanDownToClose
			onClose={() => setIsFilterByOtherOpen(false)}
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
				<Text style={[fonts.subtitle1White]}>Filters</Text>
				<Pressable onPress={() => setIsFilterByOtherOpen(false)}>
					<Image
						source={require("@/assets/icons/close.svg")}
						style={{ width: 40, height: 40 }}
					/>
				</Pressable>
			</View>
			<BottomSheetScrollView>
				{filterOtherOptions &&
					Object.keys(filterOtherOptions).map((key) => (
						<SectionOtherOptionsAccordion
							key={key}
							name={key}
							options={
								filterOtherOptions[
									key as keyof FilterOtherOptions
								] as DropdownOptions[]
							}
						/>
					))}
			</BottomSheetScrollView>
		</BottomSheet>
	);
};

export default SectionOtherFilterDropdown;
