import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable } from "react-native";

const BackButton = ({ onPress }: { onPress?: () => void }) => {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel="Go back"
			hitSlop={8}
			className="active:opacity-70"
			onPress={onPress || (() => router.back())}
		>
			<Image
				source={require("@/assets/icons/arrow_back.svg")}
				style={{ width: 32, height: 32 }}
			/>
		</Pressable>
	);
};

export default BackButton;
