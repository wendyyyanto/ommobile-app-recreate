import fonts from "@/constants/fonts";
import { router, usePathname } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImage = require("@/assets/images/background.png");

const NotFound = () => {
	const pathname = usePathname();

	useEffect(() => {
		console.log(`Unmatched route: ${pathname}`);
	}, [pathname]);

	return (
		<ImageBackground
			source={backgroundImage}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView edges={["top"]} className="flex-1 px-4">
				<View className="flex-1 justify-center items-center gap-4">
					<Text style={fonts.subtitle1White} className="text-center">
						This page isn&apos;t available
					</Text>
					<Text style={fonts.caption1Grey} className="text-center">
						The link you opened doesn&apos;t point anywhere in the
						app.
					</Text>
					<Pressable
						className="bg-charcoal-blue rounded-2xl px-6 py-3"
						onPress={() => router.replace("/")}
					>
						<Text style={fonts.body2White}>Go to Home</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export default NotFound;
