import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { DropdownOptions } from "@/types/dropdown";
import { capitalizeText } from "@/utils/textHelper";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Accordion, Square } from "tamagui";

const SectionOtherOptionsAccordion = ({
	name,
	options
}: {
	name: string;
	options: DropdownOptions[];
}) => {
	const { setSelectedFilter, selectedFilter } = useTeachingFilterStore();

	const isChecked = (optionName: string) =>
		selectedFilter?.[name]?.includes(optionName) ?? false;

	const handleCheck = (optionName: string, checked: boolean) => {
		setSelectedFilter((prevState: any) => ({
			...prevState,
			[name]: checked
				? [...(prevState?.[name] ?? []), optionName]
				: (prevState?.[name] ?? []).filter(
						(item: string) => item !== optionName
					)
		}));
	};

	return (
		<View className="px-4">
			<Accordion type="single" collapsible>
				<Accordion.Item value={name}>
					<Accordion.Trigger
						unstyled
						style={{
							backgroundColor: colors.black,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingVertical: 12
						}}
					>
						{({ open }: { open: boolean }) => (
							<>
								<Text style={fonts.body1White}>
									Filter by {capitalizeText(name)}
								</Text>

								<Square
									animation="quick"
									rotate={open ? "180deg" : "0deg"}
									backgroundColor="transparent"
								>
									<Image
										source={require("@/assets/icons/chevron_Down.svg")}
										style={{
											width: 32,
											height: 32
										}}
									/>
								</Square>
							</>
						)}
					</Accordion.Trigger>

					<Accordion.HeightAnimator animation="medium">
						<Accordion.Content
							unstyled
							animation="medium"
							exitStyle={{ opacity: 0 }}
							style={{
								backgroundColor: colors.black,
								paddingTop: 0,
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
										accessibilityRole="checkbox"
										accessibilityState={{
											checked
										}}
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
												justifyContent: "center",
												overflow: "hidden"
											}}
										>
											{checked && (
												<Image
													source={require("@/assets/icons/checked.svg")}
													style={{
														width: 24,
														height: 24
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
						</Accordion.Content>
					</Accordion.HeightAnimator>
				</Accordion.Item>
			</Accordion>
		</View>
	);
};

export default SectionOtherOptionsAccordion;
