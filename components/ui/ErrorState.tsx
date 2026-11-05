import PressableScale from "@/components/ui/PressableScale";
import fonts from "@/constants/fonts";
import { Text, View } from "react-native";

type ErrorStateProps = {
	message?: string;
	onRetry: () => void;
};

const ErrorState = ({
	message = "Couldn't load this. Check your connection and try again.",
	onRetry
}: ErrorStateProps) => {
	return (
		<View className="flex-1 justify-center items-center gap-6 px-6">
			<Text
				style={[fonts.body1White, { opacity: 0.7, textAlign: "center" }]}
			>
				{message}
			</Text>
			<PressableScale
				className="rounded-full px-8 py-3 bg-slate-gray"
				onPress={onRetry}
				accessibilityRole="button"
			>
				<Text style={fonts.subtitle1White}>Try again</Text>
			</PressableScale>
		</View>
	);
};

export default ErrorState;
