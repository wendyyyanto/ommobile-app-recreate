import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import NotificationPageSkeleton from "@/features/skeletons/NotificationPageSkeleton";
import useNotification from "@/hooks/useNotification";
import { useNotificationStore } from "@/stores/notificationStore";
import { formatDate } from "@/utils/timeHelper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
	ImageBackground,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
	const { notificationList, isLoadingNotificationList } =
		useNotificationStore();

	const {
		handleNotificationItemPressed,
		handleRefreshNotifications,
		isRefreshing
	} = useNotification();

	if (isLoadingNotificationList) return <NotificationPageSkeleton />;

	return (
		<ImageBackground
			source={require("@/assets/images/background_notification.png")}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4">
				<View className="flex-1">
					<View className="flex-row justify-between items-center mb-10">
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
					<ScrollView
						className="flex-1"
						contentContainerStyle={{ flexGrow: 1 }}
						showsVerticalScrollIndicator={false}
						alwaysBounceVertical
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={handleRefreshNotifications}
								tintColor={colors.black}
								colors={[colors.black]}
							/>
						}
					>
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
									You have no notifications right now. Come
									back later.
								</Text>
							</ImageBackground>
						) : (
							<View>
								{notificationList?.map((notification) => (
									<Pressable
										key={notification.id}
										className="mb-4"
										onPress={() => {
											handleNotificationItemPressed(
												notification.id
											);
										}}
									>
										<Text
											style={[
												fonts.subtitle2White,
												{ fontWeight: "500" }
											]}
										>
											{notification.title} -{" "}
											{formatDate(
												notification.eventDate,
												"MMMM Do, YYYY"
											)}
										</Text>
										<Text style={[fonts.caption1Grey]}>
											{formatDate(
												notification.createdAt,
												"MMMM Do, YYYY"
											)}
										</Text>
										<View
											style={{
												borderWidth: 0.5,
												borderColor: colors.darkGray,
												marginTop: 16
											}}
										/>
									</Pressable>
								))}
							</View>
						)}
					</ScrollView>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default Notifications;
