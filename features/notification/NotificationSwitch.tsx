import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { MotiView } from "moti";
import { Platform, Pressable, Switch, Text, View } from "react-native";

const trackWidth = 51;
const thumbSize = 27;
const trackPadding = 2;

// iOS only, drawn by hand instead of the native Switch: UIKit treats thumbTintColor and the
// off-track color as hints and restyles them per iOS version (e.g. iOS 26 Liquid Glass),
// so the design colors only rendered on some devices.
const NotificationSwitch = ({
	label,
	checked,
	onValueChange
}: {
	label: string;
	checked: boolean;
	onValueChange: (checked: boolean, label: string) => void;
}) => {
	if (Platform.OS === "android") {
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
	}

	return (
		<View className="min-h-12 flex-row items-center justify-between">
			<Text style={fonts.body2White}>{label}</Text>
			<Pressable
				accessibilityRole="switch"
				accessibilityLabel={label}
				accessibilityState={{ checked }}
				hitSlop={8}
				onPress={() => onValueChange(!checked, label)}
			>
				<MotiView
					animate={{
						backgroundColor: checked
							? colors.offBlack
							: colors.darkerGray
					}}
					transition={{ type: "timing", duration: 200 }}
					style={{
						width: trackWidth,
						height: thumbSize + trackPadding * 2,
						borderRadius: thumbSize,
						padding: trackPadding
					}}
				>
					<MotiView
						animate={{
							translateX: checked
								? trackWidth - thumbSize - trackPadding * 2
								: 0,
							backgroundColor: checked
								? colors.lightBlue
								: colors.darkGray
						}}
						transition={{ type: "timing", duration: 200 }}
						style={{
							width: thumbSize,
							height: thumbSize,
							borderRadius: thumbSize / 2
						}}
					/>
				</MotiView>
			</Pressable>
		</View>
	);
};

export default NotificationSwitch;
