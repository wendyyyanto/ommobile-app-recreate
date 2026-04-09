import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable } from "react-native";

const BackButton = ({ onPress }: { onPress?: () => void }) => {
	return (
		<Pressable onPress={onPress || (() => router.back())}>
			<Image
				source={require("@/assets/icons/arrow_back.svg")}
				style={{ width: 32, height: 32 }}
			/>
		</Pressable>
	);
};

export default BackButton;
