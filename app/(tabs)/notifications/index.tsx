import LoadingSpinner from "@/components/ui/LoadingSpinner";
import fonts from "@/constants/fonts";
import useNotification from "@/hooks/useNotification";
import { useNotificationStore } from "@/stores/notificationStore";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
	const { notificationList, isLoadingNotificationList } =
		useNotificationStore();
	const notificationHook = useNotification();

	if (isLoadingNotificationList)
		return (
			<View className="h-full w-full justify-center items-center">
				<LoadingSpinner />
			</View>
		);

	return (
		<ImageBackground
			source={require("@/assets/images/background_notification.png")}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4">
				<View className="flex-1">
					<Text className="text-4xl text-white font-poppins">
						Notifications
					</Text>
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
