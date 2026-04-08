import { Skeleton } from "moti/skeleton";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const TeachingPageSkeleton = () => {
	return (
		<ImageBackground
			source={backgroundImage}
			className="flex-1"
			resizeMode="cover"
		>
			<SafeAreaView edges={["top"]} className="flex-1">
				<View className="flex flex-1 flex-col gap-4 px-4">
					<View className="flex flex-row items-center justify-between">
						<Skeleton height={100} width={200} radius={10} />
						<Skeleton height={100} width={100} radius="round" />
					</View>
					<View className="flex-row gap-4 flex-wrap mt-4">
						<View className="basis-[48%]">
							<Skeleton height={60} width="100%" radius={30} />
						</View>
						<View className="basis-[48%]">
							<Skeleton height={60} width="100%" radius={30} />
						</View>
						<View className="basis-[48%]">
							<Skeleton height={60} width="100%" radius={30} />
						</View>
						<View className="basis-[48%]">
							<Skeleton height={60} width="100%" radius={30} />
						</View>
					</View>
					<View className="flex-1 flex-col gap-4 mt-14">
						<Skeleton height={80} width="100%" radius={10} />
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

export default TeachingPageSkeleton;
