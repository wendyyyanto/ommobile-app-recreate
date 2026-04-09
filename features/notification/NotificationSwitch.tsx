import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useNotificationSettings from "@/hooks/useNotificationSettings";
import { Text, View } from "react-native";
import { Switch } from "tamagui";

const NotificationSwitch = ({
	label,
	checked
}: {
	label: string;
	checked: boolean;
}) => {
	const { handleCheckedChange } = useNotificationSettings();

	return (
		<View className="flex-row justify-between items-center">
			<Text style={fonts.subtitle1White}>{label}</Text>
			<Switch
				defaultChecked={checked as any}
				onCheckedChange={(checked) =>
					handleCheckedChange(checked, label)
				}
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
