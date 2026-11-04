import PressableScale from "@/components/ui/PressableScale";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useFilterOther from "@/hooks/useFilterOther";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions, FilterOtherOptions } from "@/types/dropdown";
import BottomSheet, {
	BottomSheetFooterProps,
	BottomSheetScrollView
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
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
import SectionOtherOptionsAccordion from "./SectionOtherOptionsAccordion";
import { useShallow } from "zustand/react/shallow";

const OtherFilterFooter = (props: BottomSheetFooterProps) => {
	const { setIsFilterByOtherOpen, setSelectedFilter, selectedFilter } =
		useTeachingFilterStore(
			useShallow((s) => ({
				setIsFilterByOtherOpen: s.setIsFilterByOtherOpen,
				setSelectedFilter: s.setSelectedFilter,
				selectedFilter: s.selectedFilter
			}))
		);
	const { handleFilterTeaching } = useFilterOther();

	return (
		<FilterSheetFooter {...props} visible={Boolean(selectedFilter)}>
			<PressableScale
				className="flex-1"
				onPress={() => {
					setSelectedFilter(null);
				}}
			>
				<Text
					style={[
						fonts.body1White,
						{ color: colors.lightBlue, textAlign: "center" }
					]}
				>
					Reset Filters
				</Text>
			</PressableScale>
			<PressableScale
				className="bg-white rounded-full p-4 flex-row flex-1 items-center justify-center"
				onPress={(e) => {
					e.preventDefault();
					setIsFilterByOtherOpen(false);
					if (selectedFilter) handleFilterTeaching(selectedFilter);
				}}
			>
				<Text
					style={[
						fonts.body1White,
						{ color: colors.black, textAlign: "center" }
					]}
				>
					Apply Filters
				</Text>
			</PressableScale>
		</FilterSheetFooter>
	);
};

const SectionOtherFilterDropdown = () => {
	const {
		isFilterByOtherOpen,
		setIsFilterByOtherOpen,
		filterOtherOptions,
		setSelectedFilter
	} = useTeachingFilterStore(
		useShallow((s) => ({
			isFilterByOtherOpen: s.isFilterByOtherOpen,
			setIsFilterByOtherOpen: s.setIsFilterByOtherOpen,
			filterOtherOptions: s.filterOtherOptions,
			setSelectedFilter: s.setSelectedFilter
		}))
	);

	const bottomSheetRef = useRef<BottomSheet>(null);
	const insets = useSafeAreaInsets();

	useEffect(() => {
		if (isFilterByOtherOpen) {
			bottomSheetRef.current?.snapToIndex(FILTER_OPEN_INDEX);
		} else {
			bottomSheetRef.current?.close();
		}
	}, [isFilterByOtherOpen, setSelectedFilter]);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isFilterByOtherOpen ? FILTER_OPEN_INDEX : -1}
			snapPoints={FILTER_SNAP_POINTS}
			enableDynamicSizing={false}
			enablePanDownToClose
			topInset={insets.top}
			backdropComponent={FilterSheetBackdrop}
			footerComponent={OtherFilterFooter}
			onClose={() => setIsFilterByOtherOpen(false)}
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
				<Text style={[fonts.subtitle1White]}>Filters</Text>
				<PressableScale onPress={() => setIsFilterByOtherOpen(false)}>
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
