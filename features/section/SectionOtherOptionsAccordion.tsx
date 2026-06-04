import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import { capitalizeText } from "@/utils/textHelper";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Accordion, Checkbox, Square } from "tamagui";

const SectionOtherOptionsAccordion = ({
	name,
	options
}: {
	name: string;
	options: DropdownOptions[];
}) => {
	const { setSelectedFilter, selectedFilter } = useTeachingFilterStore();

	const toggleOption = (optionName: string, checked: boolean) => {
		if (!checked) {
			setSelectedFilter((prevState: any) => ({
				...prevState,
				[name]: prevState?.[name]?.filter(
					(item: string) => item !== optionName
				)
			}));
			return;
		}
		setSelectedFilter((prevState: any) => ({
			...prevState,
			[name]: prevState?.[name]?.length
				? [...prevState[name], optionName]
				: [optionName]
		}));
	};

	return (
		<Accordion type="multiple">
			<Accordion.Item value={name}>
				<Accordion.Trigger unstyled>
					{({ open }: { open: boolean }) => (
						<View
							style={{
								backgroundColor: colors.black,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 16,
								paddingTop: 16
							}}
						>
							<Text style={fonts.body1White}>
								Filter by {capitalizeText(name)}
							</Text>
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
						</View>
					)}
				</Accordion.Trigger>
				<Accordion.HeightAnimator>
					<Accordion.Content
						style={{
							backgroundColor: colors.black,
							padding: 0
						}}
					>
						{options.map((option) => {
							const isChecked =
								selectedFilter?.[name]?.includes(option.name) ??
								false;

							return (
								<Pressable
									key={option.id}
									className="flex-row items-center gap-4 mb-4"
									onPress={() =>
										toggleOption(option.name, !isChecked)
									}
								>
									<View pointerEvents="none">
										<Checkbox
											checked={isChecked}
											style={{
												backgroundColor: "transparent",
												overflow: "hidden"
											}}
										>
											<Checkbox.Indicator>
												<Image
													source={require("@/assets/icons/checked.svg")}
													style={{
														width: 50,
														height: 50
													}}
												/>
											</Checkbox.Indicator>
										</Checkbox>
									</View>

									<Text style={fonts.body1White}>
										{option.name}
									</Text>
								</Pressable>
							);
						})}
					</Accordion.Content>
				</Accordion.HeightAnimator>
			</Accordion.Item>
		</Accordion>
	);
};

export default SectionOtherOptionsAccordion;
