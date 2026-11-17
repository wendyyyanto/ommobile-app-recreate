import PressableScale from "@/components/ui/PressableScale";
import colors from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Text, View } from "react-native";

type Category = {
	id: string;
	name: string;
	icon: keyof typeof Feather.glyphMap;
	tile: string;
	iconColor: string;
};

const newTestament: Category = {
	id: "new-testament",
	name: "New Testament",
	icon: "book-open",
	tile: "rgba(47,158,143,0.22)",
	iconColor: "#7EE0D0"
};

const stacked: Category[] = [
	{
		id: "old-testament",
		name: "Old Testament",
		icon: "book",
		tile: "rgba(217,154,61,0.22)",
		iconColor: "#F5C97A"
	},
	{
		id: "topical",
		name: "Topical",
		icon: "layers",
		tile: "rgba(123,92,196,0.22)",
		iconColor: "#C3ADF2"
	}
];

const openSection = ({ id, name }: Category) =>
	router.push(`/teachings/section/${id}?name=${name}`);

const TeachingCategoryBento = () => (
	<View className="flex-row gap-2 h-[136px]">
		<PressableScale
			accessibilityRole="button"
			accessibilityLabel={newTestament.name}
			className="flex-1 rounded-2xl border border-dark-slate-blue overflow-hidden"
			onPress={() => openSection(newTestament)}
		>
			<LinearGradient
				colors={["rgba(47,158,143,0.38)", colors.charcoalBlue]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					flex: 1,
					padding: 14,
					justifyContent: "space-between"
				}}
			>
				<View
					className="w-10 h-10 rounded-xl items-center justify-center"
					style={{ backgroundColor: newTestament.tile }}
				>
					<Feather
						name={newTestament.icon}
						size={22}
						color={newTestament.iconColor}
					/>
				</View>
				<View>
					<Text className="text-white font-poppins text-[15px]">
						{newTestament.name}
					</Text>
					<Text
						className="text-light-steel-gray font-poppins text-xs"
						numberOfLines={1}
					>
						Matthew to Revelation
					</Text>
				</View>
			</LinearGradient>
		</PressableScale>
		<View className="flex-1 gap-2">
			{stacked.map((category) => (
				<PressableScale
					key={category.id}
					accessibilityRole="button"
					accessibilityLabel={category.name}
					className="flex-1 flex-row items-center gap-2 pl-2.5 pr-2 rounded-2xl border border-dark-slate-blue bg-charcoal-blue"
					onPress={() => openSection(category)}
				>
					<View
						className="w-7 h-7 rounded-lg items-center justify-center"
						style={{ backgroundColor: category.tile }}
					>
						<Feather
							name={category.icon}
							size={16}
							color={category.iconColor}
						/>
					</View>
					<Text
						className="flex-1 text-white font-poppins text-[13px]"
						numberOfLines={1}
					>
						{category.name}
					</Text>
				</PressableScale>
			))}
		</View>
	</View>
);

export default TeachingCategoryBento;
