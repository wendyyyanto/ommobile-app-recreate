import BackButton from "@/components/ui/BackButton";
import fonts from "@/constants/fonts";
import NotificationSwitch from "@/features/notification/NotificationSwitch";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationSettings = () => {
	const notificationSettingsList = [
		{
			name: "MG Turby",
			checked: false
		},
		{
			name: "MG Starling",
			checked: true
		},
		{
			name: "MG Tenggiri",
			checked: false
		}
	];

	return (
		<SafeAreaView edges={["top"]} className="flex-1 px-4 bg-black gap-8">
			<View className="flex-row items-center gap-4">
				<BackButton />
				<Text style={fonts.body2White}>Notification Settings</Text>
			</View>
			<Text className="text-xl text-white font-semibold">
				Notify me from these categories
			</Text>

			<View className="gap-4">
				{notificationSettingsList.map((setting) => (
					<NotificationSwitch
						defaultChecked={setting.checked}
						key={setting.name}
						label={setting.name}
					/>
				))}
			</View>
		</SafeAreaView>
	);
};

export default NotificationSettings;
