import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import { capitalizeText } from "@/utils/textHelper";
import { Image } from "expo-image";
import { useState } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from "react-native-reanimated";

const SectionOtherOptionsAccordion = ({
	name,
	options
}: {
	name: string;
	options: DropdownOptions[];
}) => {
	const [open, setOpen] = useState(false);
	const rotation = useSharedValue(0);

	const { setSelectedFilter, selectedFilter } = useTeachingFilterStore();

	const chevronStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }]
	}));

	const toggle = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		const next = !open;
		setOpen(next);
		rotation.value = withTiming(next ? 180 : 0, { duration: 300 });
	};

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
				<Text style={fonts.body1White}>
					Filter by {capitalizeText(name)}
				</Text>
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
					{options.map((option) => {
						const checked = isChecked(option.name);
						return (
							<Pressable
								key={option.id}
								className="flex-row items-center gap-4 py-2"
								onPress={() =>
									handleCheck(option.name, !checked)
								}
							>
								<View
									style={{
										width: 24,
										height: 24,
										borderRadius: 4,
										backgroundColor: checked
											? colors.steelBlue
											: colors.darkerGray,
										alignItems: "center",
										justifyContent: "center"
									}}
								>
									{checked && (
										<Image
											source={require("@/assets/icons/checked.svg")}
											style={{
												width: 60,
												height: 60,
												overflow: "hidden"
											}}
										/>
									)}
								</View>
								<Text style={fonts.body1White}>
									{option.name}
								</Text>
							</Pressable>
						);
					})}
				</View>
			)}
		</View>
	);
};

export default SectionOtherOptionsAccordion;
