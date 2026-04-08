import { Skeleton } from "moti/skeleton";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const HomePageSkeleton = () => {
	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top"]} className="flex-1">
				<View className="flex-1 flex-col gap-10 px-4">
					<Skeleton height={120} width={160} radius={10} />
					<Skeleton height={200} width="100%" radius={10} />
					<View className="flex-1 flex-col gap-4">
						<View className="flex-row justify-between items-center">
							<View />
							<Skeleton height={30} width={100} radius="round" />
						</View>
						<Skeleton height={80} width="100%" radius={10} />
						<Skeleton height={80} width="100%" radius={10} />
						<Skeleton height={80} width="100%" radius={10} />
						<Skeleton height={80} width="100%" radius={10} />
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default HomePageSkeleton;
