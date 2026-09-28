import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import fonts from "@/constants/fonts";
import useNotificationDetail from "@/hooks/useNotificationDetail";
import { useNotificationStore } from "@/stores/notificationStore";
import { formatDate } from "@/utils/timeHelper";
import { Image } from "expo-image";
import { ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationDetail = () => {
	const { notificationDetail, isLoadingNotificationDetail } =
		useNotificationStore();

	useNotificationDetail();

	if (isLoadingNotificationDetail) {
		return (
			<View className="flex-1 justify-center items-center">
				<LoadingSpinner label="Loading notification detail..." />
			</View>
		);
	}

	return (
		<ImageBackground
			source={require("@/assets/images/background_notification.png")}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4 gap-8">
				<BackButton />
				<View className="flex-1 gap-3">
					{notificationDetail?.imageUrl && (
						<Image
							source={{ uri: notificationDetail?.imageUrl }}
							style={{
								width: "100%",
								height: 200,
								borderRadius: 16,
								marginBottom: 22
							}}
							contentFit="cover"
						/>
					)}
					<Text style={fonts.caption1Grey}>
						{formatDate(
							notificationDetail?.createdAt!,
							"MMMM Do, YYYY"
						)}
					</Text>
					<Text className="text-white text-2xl font-semibold">
						{notificationDetail?.title} -{" "}
						{formatDate(
							notificationDetail?.eventDate!,
							"MMMM Do, YYYY"
						)}
					</Text>
					<Text style={fonts.body1White}>
						{notificationDetail?.fullMessage}
					</Text>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default NotificationDetail;
