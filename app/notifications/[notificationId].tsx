import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import fonts from "@/constants/fonts";
import { CONTENT_FADE } from "@/constants/motion";
import useNotificationDetail from "@/hooks/useNotificationDetail";
import { useNotificationStore } from "@/stores/notificationStore";
import { formatDate } from "@/utils/timeHelper";
import { Image } from "expo-image";
import { ImageBackground, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

const NotificationDetail = () => {
	const {
		notificationDetail,
		isLoadingNotificationDetail
	} = useNotificationStore(
		useShallow((s) => ({
			notificationDetail: s.notificationDetail,
			isLoadingNotificationDetail: s.isLoadingNotificationDetail
		}))
	);

	useNotificationDetail();

	return (
		<ImageBackground
			source={require("@/assets/images/background_notification.webp")}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4 gap-8">
				<BackButton />
				{isLoadingNotificationDetail ? (
					<View className="flex-1 justify-center items-center">
						<LoadingSpinner label="Loading notification detail..." />
					</View>
				) : (
					<Animated.View
						entering={CONTENT_FADE}
						style={{ flex: 1, gap: 12 }}
					>
						{notificationDetail?.thumbnail && (
							<Image
								source={{ uri: notificationDetail.thumbnail.url }}
								style={{
									width: "100%",
									height: 200,
									borderRadius: 16,
									marginBottom: 22
								}}
								contentFit="cover"
								transition={200}
							/>
						)}
						<Text style={fonts.caption1Grey}>
							{formatDate(
								notificationDetail?.created_at!,
								"MMMM Do, YYYY"
							)}
						</Text>
						<Text className="text-white text-2xl font-semibold">
							{notificationDetail?.title} -{" "}
							{formatDate(
								notificationDetail?.event_date!,
								"MMMM Do, YYYY"
							)}
						</Text>
						<Text style={fonts.body1White}>
							{notificationDetail?.description}
						</Text>
					</Animated.View>
				)}
			</SafeAreaView>
		</ImageBackground>
	);
};

export default NotificationDetail;
