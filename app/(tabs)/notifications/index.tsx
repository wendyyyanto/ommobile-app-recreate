import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
	return (
		<ImageBackground
			source={require("@/assets/images/background_notification.png")}
			resizeMode="contain"
			style={{
				position: "absolute",
				left: 0,
				top: 0
			}}
		>
			<SafeAreaView></SafeAreaView>
		</ImageBackground>
	);
};

export default Notifications;
