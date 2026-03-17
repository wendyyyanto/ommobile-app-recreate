import { Image } from "expo-image";
import { router } from "expo-router";
import { ImageBackground, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const SearchTeaching = () => {
	return (
		<ImageBackground source={backgroundImage} className="flex-1">
			<SafeAreaView
				edges={["top", "bottom"]}
				className="flex-1 px-4 gap-7"
			>
				<View className="flex flex-row justify-between items-start">
					<Pressable
						className="rounded-full px-5 py-5 bg-slate-gray"
						onPress={() => router.back()}
					>
						<Image
							source={require("@/assets/icons/arrow_back.svg")}
							style={{ width: 14, height: 14 }}
						/>
					</Pressable>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default SearchTeaching;
