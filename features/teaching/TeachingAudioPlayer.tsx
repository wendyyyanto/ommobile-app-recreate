import Slider from "@react-native-community/slider";
import { View } from "react-native";

const TeachingAudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
	return (
		<View>
			<Slider
				minimumValue={0}
				maximumValue={1}
				minimumTrackTintColor="#FFFFFF"
				maximumTrackTintColor="#000000"
			/>
		</View>
	);
};

export default TeachingAudioPlayer;
