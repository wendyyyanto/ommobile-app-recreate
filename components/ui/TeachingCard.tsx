import fonts from "@/constants/fonts";
import useTeachingCard from "@/hooks/useTeachingCard";
import { Teaching } from "@/types/teaching";
import { getImageSource } from "@/utils/imageHelper";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

const TeachingCard = ({ teaching }: { teaching: Teaching }) => {
	const { handleTeachingCardPress } = useTeachingCard();
	return (
		<Pressable
			className="flex-1 text-white p-4 flex flex-row gap-4 bg-charcoal-blue rounded-2xl border-dark-slate-blue border"
			onPress={() => handleTeachingCardPress(teaching.id)}
		>
			<Image
				source={getImageSource(teaching.thumbnailUrl)}
				transition={1000}
				style={{
					width: 62,
					height: 62,
					borderRadius: 16
				}}
				contentFit="cover"
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
		</Pressable>
	);
};

export default TeachingCard;
