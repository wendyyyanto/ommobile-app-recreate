import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import NotificationSwitch from "@/features/notification/NotificationSwitch";
import useNotificationSettings from "@/hooks/useNotificationSettings";
import { useNotificationStore } from "@/stores/notificationStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationSettings = () => {
	const { notificationSegments, userNotificationTags } =
		useNotificationStore();
	const {
		handleCheckedChange,
		hasNotificationSettingsError,
		isLoadingNotificationSettings,
		loadNotificationSettings
	} = useNotificationSettings();

	return (
		<SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-black">
			<ScrollView
				className="flex-1"
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<View className="flex-row items-center gap-6 px-4 pt-4">
					<BackButton />
					<Text style={fonts.body2White}>Settings</Text>
				</View>

				<View className="px-4 pb-5 pt-6">
					<Text className="font-poppins text-[32px] text-white">
						Charbel
					</Text>
					<Text
						style={[
							fonts.body2White,
							{ color: colors.lightSteelGray }
						]}
						className="mt-1"
					>
						charbelangelia@gmail.com
					</Text>
				</View>

				<View className="h-px bg-dark-slate-blue" />

				<View className="px-4 pb-4 pt-7">
					<Text
						style={[
							fonts.body2White,
							{ fontFamily: "Poppins_500Medium" }
						]}
					>
						Notify me from these categories:
					</Text>

					{isLoadingNotificationSettings ? (
						<View className="min-h-72 justify-center">
							<LoadingSpinner label="Loading notification settings..." />
						</View>
					) : hasNotificationSettingsError ? (
						<View className="min-h-72 items-center justify-center gap-4">
							<Text
								style={fonts.body1White}
								className="text-center opacity-70"
							>
								Unable to load notification settings.
							</Text>
							<Pressable
								className="rounded-full bg-charcoal-blue px-6 py-3"
								onPress={() => void loadNotificationSettings()}
							>
								<Text style={fonts.caption1White}>
									Try Again
								</Text>
							</Pressable>
						</View>
					) : notificationSegments.length === 0 ? (
						<Text
							style={fonts.body1White}
							className="min-h-72 pt-8 text-center opacity-70"
						>
							No notification categories are available.
						</Text>
					) : (
						<View className="mt-4">
							{notificationSegments.map((setting) => {
								const parseTagName = setting.name
									.toLowerCase()
									.replace(/ /g, "_");
								const isChecked =
									userNotificationTags?.[parseTagName] ===
									"active";

								return (
									<NotificationSwitch
										checked={isChecked}
										key={setting.name}
										label={setting.name}
										onValueChange={handleCheckedChange}
									/>
								);
							})}
						</View>
					)}
				</View>

				<View className="h-px bg-dark-slate-blue" />

				<Pressable
					className="flex-row items-center gap-2 px-4 py-8"
					hitSlop={8}
					onPress={() => undefined}
				>
					<Ionicons name="log-out-outline" size={24} color="white" />
					<Text style={fonts.body2White}>Logout</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
};

export default NotificationSettings;
