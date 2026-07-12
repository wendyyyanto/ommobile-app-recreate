import fonts from "@/constants/fonts";
import { TeachingDetails } from "@/types/teaching";
import { Text, View } from "react-native";

const TeachingMetadata = ({
	teachingDetails
}: {
	teachingDetails: TeachingDetails | null;
}) => {
	return (
		<View className="gap-2">
			<Text
				style={[fonts.caption2White, { marginTop: 30, textAlign: "center" }]}
			>
				{teachingDetails?.book} {teachingDetails?.chapters}{" "}
				{`: ${teachingDetails?.verses}`}
			</Text>
			<Text
				style={{
					fontSize: 20,
					color: "white",
					fontWeight: 600,
					textAlign: "center"
				}}
			>
				{teachingDetails?.title}
			</Text>
			<Text style={[fonts.caption2White, { textAlign: "center" }]}>
				{teachingDetails?.teacher ?? "Unknown Teacher"}
			</Text>
		</View>
	);
};

export default TeachingMetadata;
