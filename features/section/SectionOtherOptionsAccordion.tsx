import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import {
	BACKGROUND_TRANSITION,
	EASE_OUT,
	QUICK_FADE,
	QUICK_FADE_OUT,
	ROTATE_TRANSITION,
	ROW_LAYOUT
} from "@/constants/motion";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import { capitalizeText } from "@/utils/textHelper";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import Animated, { Keyframe, useReducedMotion } from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

const CHECK_ENTER = new Keyframe({
	from: { opacity: 0, transform: [{ scale: 0.9 }] },
	to: { opacity: 1, transform: [{ scale: 1 }], easing: EASE_OUT }
}).duration(150);

const SectionOtherOptionsAccordion = ({
	name,
	options
}: {
	name: string;
	options: DropdownOptions[];
}) => {
	const [open, setOpen] = useState(false);
	const reduced = useReducedMotion();

	const {
		setSelectedFilter,
		selectedFilter
	} = useTeachingFilterStore(
		useShallow((s) => ({
			setSelectedFilter: s.setSelectedFilter,
			selectedFilter: s.selectedFilter
		}))
	);

	const isChecked = (optionName: string) =>
		selectedFilter?.[name]?.includes(optionName) ?? false;

	const handleCheck = (optionName: string, checked: boolean) => {
		if (!checked) {
			setSelectedFilter((prevState: any) => ({
				...prevState,
				[name]: prevState?.[name]?.filter(
					(item: string) => item !== optionName
				)
			}));
		} else {
			setSelectedFilter((prevState: any) => ({
				...prevState,
				[name]: prevState?.[name]?.length
					? [...prevState[name], optionName]
					: [optionName]
			}));
		}
	};

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
				<Text style={fonts.body1White}>
					Filter by {capitalizeText(name)}
				</Text>
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
					{options.map((option) => {
						const checked = isChecked(option.name);
						return (
							<Pressable
								key={option.id}
								className="flex-row items-center gap-4 py-2"
								onPress={() => {
									void Haptics.selectionAsync();
									handleCheck(option.name, !checked);
								}}
							>
								<Animated.View
									style={[
										BACKGROUND_TRANSITION,
										{
											width: 24,
											height: 24,
											borderRadius: 4,
											backgroundColor: checked
												? colors.steelBlue
												: colors.darkerGray,
											alignItems: "center",
											justifyContent: "center"
										}
									]}
								>
									{checked && (
										<Animated.View
											entering={reduced ? QUICK_FADE : CHECK_ENTER}
										>
											<Image
												source={require("@/assets/icons/checked.svg")}
												style={{
													width: 60,
													height: 60,
													overflow: "hidden"
												}}
											/>
										</Animated.View>
									)}
								</Animated.View>
								<Text style={fonts.body1White}>
									{option.name}
								</Text>
							</Pressable>
						);
					})}
				</Animated.View>
			)}
		</Animated.View>
	);
};

export default SectionOtherOptionsAccordion;
