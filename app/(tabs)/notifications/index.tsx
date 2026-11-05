import ErrorState from "@/components/ui/ErrorState";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { CONTENT_FADE } from "@/constants/motion";
import { NotificationListSkeleton } from "@/features/skeletons/ContentSkeletons";
import useNotification from "@/hooks/useNotification";
import { useNotificationStore } from "@/stores/notificationStore";
import { formatDate } from "@/utils/timeHelper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
	FlatList,
	ImageBackground,
	Pressable,
	RefreshControl,
	Text,
	View
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
	const notificationList = useNotificationStore((s) => s.notificationList);
	const isLoadingNotificationList = useNotificationStore(
		(s) => s.isLoadingNotificationList
	);

	const {
		hasError,
		handleNotificationItemPressed,
		handleRefreshNotifications,
		isRefreshing
	} = useNotification();

	return (
		<ImageBackground
			source={require("@/assets/images/background_notification.webp")}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4 mt-6">
				<View className="flex-1">
					<View className="flex-row justify-between items-center mb-10">
						<Text className="text-4xl text-white font-poppins">
							Notifications
						</Text>

						<Pressable
							hitSlop={12}
							accessibilityRole="button"
							accessibilityLabel="Settings"
							className="z-10 active:opacity-70"
							onPress={() => router.push("/settings")}
						>
							<Ionicons
								name="settings-outline"
								size={24}
								color="white"
							/>
						</Pressable>
					</View>
					{isLoadingNotificationList ? (
						<NotificationListSkeleton count={8} />
					) : (
						<Animated.View entering={CONTENT_FADE} style={{ flex: 1 }}>
							<FlatList
								data={notificationList}
								keyExtractor={(notification) => String(notification.id)}
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
								ListEmptyComponent={
									hasError ? (
										<ErrorState
											message="Couldn't load notifications. Check your connection and try again."
											onRetry={handleRefreshNotifications}
										/>
									) : (
										<ImageBackground
											imageStyle={{ transform: [{ scale: 1.5 }] }}
											source={require("@/assets/images/notif_empty.webp")}
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
												You have no notifications right now. Come back later.
											</Text>
										</ImageBackground>
									)
								}
								renderItem={({ item: notification }) => (
									<Pressable
										className="mb-4 active:opacity-70"
										onPress={() => {
											handleNotificationItemPressed(notification.id);
										}}
									>
										<Text style={[fonts.subtitle2White, { fontWeight: "500" }]}>
											{notification.title} -{" "}
											{formatDate(notification.event_date, "MMMM Do, YYYY")}
										</Text>
										<Text style={[fonts.caption1Grey]}>
											{formatDate(notification.created_at, "MMMM Do, YYYY")}
										</Text>
										<View
											style={{
												borderWidth: 0.5,
												borderColor: colors.darkGray,
												marginTop: 16
											}}
										/>
									</Pressable>
								)}
							/>
						</Animated.View>
					)}
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default Notifications;
