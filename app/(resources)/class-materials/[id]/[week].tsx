import LoadingSpinner from "@/components/ui/LoadingSpinner";
import fonts from "@/constants/fonts";
import PdfViewer from "@/features/teaching/PdfViewer";
import { useClassStore } from "@/stores/classStore";
import { ClassMaterial } from "@/types/class";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isPdf = (material: ClassMaterial) =>
	material.file?.content_type === "application/pdf";

const mediaType = (material: ClassMaterial) => {
	const type = material.file?.content_type.split("/")[0];
	return type === "video" || type === "audio" ? type : undefined;
};

const materialIcon = (material: ClassMaterial) => {
	if (isPdf(material)) return require("@/assets/icons/pdf.svg");
	if (mediaType(material) === "video") return require("@/assets/icons/play.svg");
	if (mediaType(material) === "audio") return require("@/assets/icons/audio.svg");
	return require("@/assets/icons/ppt.svg");
};

export default function ClassWeekMaterialsScreen() {
	const { week } = useLocalSearchParams<{ id: string; week: string }>();
	// Loaded by the class detail screen, which is always below this one in the stack.
	const classDetails = useClassStore((state) => state.classDetails);
	const [openedMaterial, setOpenedMaterial] = useState<ClassMaterial | null>(
		null
	);

	const materials =
		classDetails?.materials.filter(
			(material) => material.week === Number(week)
		) ?? [];

	const handleMaterialPressed = (material: ClassMaterial) => {
		if (material.file) setOpenedMaterial(material);
	};

	return (
		<SafeAreaView
			edges={["top"]}
			className="flex-1 flex-col gap-7 px-4 py-5"
		>
			<View className="flex-row items-center gap-4">
				<Pressable
					style={{ width: 40, height: 40 }}
					onPress={() => router.back()}
				>
					<Image
						source={require("@/assets/icons/arrow_back.svg")}
						style={{ width: 40, height: 40 }}
					/>
				</Pressable>
				<Text style={fonts.body2White}>Week {week}</Text>
			</View>
			{!classDetails ? (
				<View className="flex-1 justify-center">
					<LoadingSpinner />
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className="flex-1 pb-8 gap-3">
						{materials.length === 0 && (
							<Text
								style={fonts.caption1Grey}
								className="text-center"
							>
								No materials for this week yet.
							</Text>
						)}
						{materials.map((material) => (
							<Pressable
								key={material.id}
								className="flex-row items-center gap-4 px-5 py-4 bg-charcoal-blue rounded-3xl"
								disabled={!material.file}
								onPress={() => handleMaterialPressed(material)}
							>
								<Image
									source={materialIcon(material)}
									style={
										mediaType(material) === "video"
											? { width: 12, height: 20 }
											: { width: 32, height: 40 }
									}
									contentFit="contain"
								/>
								<Text
									style={fonts.subtitle1White}
									className="flex-1"
								>
									{material.title}
								</Text>
							</Pressable>
						))}
					</View>
				</ScrollView>
			)}
			<Modal
				visible={Boolean(openedMaterial)}
				animationType="slide"
				onRequestClose={() => setOpenedMaterial(null)}
			>
				{openedMaterial?.file && (
					<PdfViewer
						source={openedMaterial.file.url}
						isPdf={isPdf(openedMaterial)}
						media={mediaType(openedMaterial)}
						onClose={() => setOpenedMaterial(null)}
					/>
				)}
			</Modal>
		</SafeAreaView>
	);
}
