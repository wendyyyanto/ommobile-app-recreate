import fonts from "@/constants/fonts";
import LottieView from "lottie-react-native";
import { StyleProp, Text, View, ViewStyle } from "react-native";

const LoadingSpinner = ({
	label = "Loading ...",
	size = 100,
	styleProps
}: {
	label?: string;
	size?: number;
	styleProps?: StyleProp<ViewStyle>;
}) => {
	return (
		<View className="justify-center items-center">
			<LottieView
				source={require("@/assets/animations/loading.json")}
				style={{ width: size, height: size, ...(styleProps as object) }}
				autoPlay
				loop
			/>
			<Text style={fonts.body1White}>{label}</Text>
		</View>
	);
};

export default LoadingSpinner;
