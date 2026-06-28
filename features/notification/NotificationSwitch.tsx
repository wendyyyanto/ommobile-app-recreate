import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import useNotificationSettings from "@/hooks/useNotificationSettings";
import { Switch, Text, View } from "react-native";

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
				value={checked}
				onValueChange={(value) => handleCheckedChange(value, label)}
				trackColor={{
					false: colors.darkerGray,
					true: colors.offBlack
				}}
				thumbColor={checked ? colors.lightBlue : colors.darkGray}
			/>
		</View>
	);
};

export default NotificationSwitch;
