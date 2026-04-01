import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { DropdownOptions } from "@/types/dropdown";
import { capitalizeText } from "@/utils/textHelper";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { Accordion, Checkbox, Label, Square } from "tamagui";

const SectionOtherOptionsAccordion = ({
	name,
	options
}: {
	name: string;
	options: DropdownOptions[];
}) => {
	return (
		<Accordion type="multiple">
			<Accordion.Item value={name}>
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
						</>
					)}
				</Accordion.Trigger>
				<Accordion.HeightAnimator>
					<Accordion.Content
						style={{
							backgroundColor: colors.black
						}}
					>
						{options.map((option) => (
							<View
								key={option.id}
								className="flex-row items-center gap-4"
							>
								<Checkbox
									style={{
										backgroundColor: "transparent",
										overflow: "hidden"
									}}
								>
									<Checkbox.Indicator>
										<Image
											source={require("@/assets/icons/checked.svg")}
											style={{ width: 50, height: 50 }}
										/>
									</Checkbox.Indicator>
								</Checkbox>

								<Label>
									<Text style={fonts.body1White}>
										{option.name}
									</Text>
								</Label>
							</View>
						))}
					</Accordion.Content>
				</Accordion.HeightAnimator>
			</Accordion.Item>
		</Accordion>
	);
};

export default SectionOtherOptionsAccordion;
