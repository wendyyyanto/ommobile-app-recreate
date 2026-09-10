import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Switch, Text, View } from "react-native";

const NotificationSwitch = ({
	label,
	checked,
	onValueChange
}: {
	label: string;
	checked: boolean;
	onValueChange: (checked: boolean, label: string) => void;
}) => {
	return (
		<View className="min-h-12 flex-row items-center justify-between">
			<Text style={fonts.body2White}>{label}</Text>
			<Switch
				value={checked}
				onValueChange={(value) => onValueChange(value, label)}
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
