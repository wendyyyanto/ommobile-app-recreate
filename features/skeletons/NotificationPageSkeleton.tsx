import { Skeleton } from "moti/skeleton";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background_notification.png");

const NotificationPageSkeleton = () => {
	return (
		<ImageBackground
			source={backgroundImage}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4">
				<View className="flex-row justify-between items-center mb-14">
					<Skeleton height={50} width={300} radius={10} />
					<Skeleton height={50} width={50} radius="round" />
				</View>
				<View className="flex-col gap-4">
					<View className="flex-col gap-2">
						<Skeleton height={50} width="100%" radius={8} />
						<Skeleton height={30} width="20%" radius={6} />
					</View>
					<View className="flex-col gap-2">
						<Skeleton height={50} width="100%" radius={8} />
						<Skeleton height={30} width="20%" radius={6} />
					</View>
					<View className="flex-col gap-2">
						<Skeleton height={50} width="100%" radius={8} />
						<Skeleton height={30} width="20%" radius={6} />
					</View>
					<View className="flex-col gap-2">
						<Skeleton height={50} width="100%" radius={8} />
						<Skeleton height={30} width="20%" radius={6} />
					</View>
					<View className="flex-col gap-2">
						<Skeleton height={50} width="100%" radius={8} />
						<Skeleton height={30} width="20%" radius={6} />
					</View>
					<View className="flex-col gap-2">
						<Skeleton height={50} width="100%" radius={8} />
						<Skeleton height={30} width="20%" radius={6} />
					</View>
					<View className="flex-col gap-2">
						<Skeleton height={50} width="100%" radius={8} />
						<Skeleton height={30} width="20%" radius={6} />
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default NotificationPageSkeleton;
