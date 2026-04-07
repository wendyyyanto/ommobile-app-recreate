import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Text, View } from "react-native";
import { Switch } from "tamagui";

const NotificationSwitch = ({
	label,
	defaultChecked = false
}: {
	label: string;
	defaultChecked: boolean;
}) => {
	return (
		<View className="flex-row justify-between items-center">
			<Text style={fonts.subtitle1White}>{label}</Text>
			<Switch
				defaultChecked={defaultChecked as any}
				onCheckedChange={(checked) => {
					console.log(checked);
				}}
				backgroundColor={colors.darkerGray as any}
				activeStyle={{
					backgroundColor: colors.offBlack
				}}
			>
				<Switch.Thumb
					backgroundColor={colors.darkGray as any}
					activeStyle={{
						backgroundColor: colors.lightBlue as any
					}}
					transition={{
						speed: 100
					}}
				/>
			</Switch>
		</View>
	);
};

export default NotificationSwitch;
