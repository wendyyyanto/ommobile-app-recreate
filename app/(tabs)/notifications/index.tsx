import LoadingSpinner from "@/components/ui/LoadingSpinner";
import fonts from "@/constants/fonts";
import useNotification from "@/hooks/useNotification";
import { useNotificationStore } from "@/stores/notificationStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
	const { notificationList, isLoadingNotificationList } =
		useNotificationStore();

	useNotification();

	if (isLoadingNotificationList)
		return (
			<ImageBackground
				source={require("@/assets/images/background_notification.png")}
				resizeMode="cover"
				className="flex-1"
			>
				<View className="h-full w-full justify-center items-center">
					<LoadingSpinner label="Loading notifications..." />
				</View>
			</ImageBackground>
		);

	return (
		<ImageBackground
			source={require("@/assets/images/background_notification.png")}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4">
				<View className="flex-1">
					<View className="flex-row justify-between items-center">
						<Text className="text-4xl text-white font-poppins">
							Notifications
						</Text>

						<Pressable
							hitSlop={12}
							className="z-10"
							onPress={() =>
								router.push("/notifications/settings")
							}
						>
							<Ionicons
								name="settings-outline"
								size={24}
								color="white"
							/>
						</Pressable>
					</View>
					{notificationList?.length === 0 ? (
						<ImageBackground
							imageStyle={{ transform: [{ scale: 1.5 }] }}
							source={require("@/assets/images/notif_empty.png")}
							className="flex-1 justify-center items-center"
							resizeMode="contain"
						>
							<Text
								style={[
									fonts.body1White,
									{
										opacity: 0.7,
										marginTop: 160,
										width: "80%",
										textAlign: "center"
									}
								]}
							>
								You have no notifications right now. Come back
								later.
							</Text>
						</ImageBackground>
					) : (
						<ScrollView>
							{notificationList?.map((notification) => (
								<Text key={notification.id}>
									{notification.title}
								</Text>
							))}
						</ScrollView>
					)}
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default Notifications;
