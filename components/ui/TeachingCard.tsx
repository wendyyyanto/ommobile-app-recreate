import fonts from "@/constants/fonts";
import { Teaching } from "@/types/teaching";
import { Image, Text, View } from "react-native";

const TeachingCard = ({ teaching }: { teaching: Teaching }) => {
	return (
		<View className="flex-1 text-white p-4 flex flex-row gap-4 bg-charcoal-blue rounded-2xl">
			<Image
				source={{ uri: teaching.thumbnailUrl }}
				resizeMode="cover"
				className="w-20 h-20 rounded-2xl"
			/>
			<View className="flex-1 flex justify-between max-h-20 w-full">
				<Text
					style={fonts.subtitle1White}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{teaching.title}
				</Text>
				<Text
					style={fonts.caption1Grey}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{teaching.book} {teaching.chapters} : {teaching.verses}
				</Text>
				<Text
					style={fonts.caption1Grey}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{teaching.teacher}
				</Text>
			</View>
		</View>
	);
};

export default TeachingCard;
