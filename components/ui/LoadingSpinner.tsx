import fonts from "@/constants/fonts";
import LottieView from "lottie-react-native";
import { Text, View } from "react-native";

const LoadingSpinner = ({ label = "Loading ..." }: { label?: string }) => {
	return (
		<View className="justify-center items-center">
			<LottieView
				source={require("@/assets/animations/loading.json")}
				style={{ width: 100, height: 100 }}
				autoPlay
				loop
			/>
			<Text style={fonts.body1White}>{label}</Text>
		</View>
	);
};

export default LoadingSpinner;
