import fonts from "@/constants/fonts";
import useTeachingCard from "@/hooks/useTeachingCard";
import { Teaching } from "@/types/teaching";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

const TeachingCard = ({ teaching }: { teaching: Teaching }) => {
	const { handleTeachingCardPress } = useTeachingCard();
	const passage = [teaching.passage, teaching.chapters]
		.filter((v) => v?.trim())
		.join(" ");
	const teacher = teaching.teacher?.trim();
	const metaLines =
		passage || teacher
			? [passage || "Unknown", teacher || "Unknown"]
			: ["Unknown"];
	return (
		<Pressable
			className="flex-1 text-white p-4 flex flex-row gap-4 bg-charcoal-blue rounded-2xl border-dark-slate-blue border"
			onPress={() => handleTeachingCardPress(teaching.id)}
		>
			<Image
				source={teaching.thumbnail_url}
				transition={1000}
				style={{
					width: 62,
					height: 62,
					borderRadius: 16
				}}
				contentFit="cover"
			/>
			<View className="flex-1 justify-center gap-1 min-h-[62px]">
				<Text
					style={fonts.subtitle1White}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{teaching.title}
				</Text>
				{metaLines.map((line, i) => (
					<Text
						key={i}
						style={fonts.caption1Grey}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{line}
					</Text>
				))}
			</View>
		</Pressable>
	);
};

export default TeachingCard;
