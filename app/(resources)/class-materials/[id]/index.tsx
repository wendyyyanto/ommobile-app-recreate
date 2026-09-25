import LoadingSpinner from "@/components/ui/LoadingSpinner";
import fonts from "@/constants/fonts";
import { getClassDetails } from "@/services/classServices";
import { useClassStore } from "@/stores/classStore";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClassMaterialsDetailScreen() {
	const { id, title, totalWeeks } = useLocalSearchParams<{
		id: string;
		title?: string;
		totalWeeks?: string;
	}>();
	const { classDetails, setClassDetails } = useClassStore();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setClassDetails(null);
		void getClassDetails(id, {
			onSuccess: (response) => setClassDetails(response.data),
			onError: (error) => console.log(error),
			onFulfilled: () => setIsLoading(false)
		});
	}, [id, setClassDetails]);

	// Week count comes from the class list; fall back to the detail response on deep links.
	const weekCount = Number(totalWeeks) || classDetails?.total_weeks || 0;
	const weeks = Array.from({ length: weekCount }, (_, index) => index + 1);

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
				<Text style={fonts.body2White} className="flex-1">
					{title ?? classDetails?.title}
				</Text>
			</View>
			{isLoading && !weekCount ? (
				<View className="flex-1 justify-center">
					<LoadingSpinner />
				</View>
			) : (
				<View className="flex-1 flex-col gap-4">
					{classDetails?.description ? (
						<Text style={fonts.caption2Grey}>
							{classDetails.description}
						</Text>
					) : null}
					<Text style={fonts.caption1Grey}>
						Total {weekCount} Weeks
					</Text>
					<ScrollView showsVerticalScrollIndicator={false}>
						{weeks.map((week) => (
							<Pressable
								className="flex flex-row justify-between items-center px-4 py-3 bg-charcoal-blue rounded-2xl mb-3"
								key={week}
								onPress={() =>
									router.push({
										pathname: "/class-materials/[id]/[week]",
										params: { id, week }
									})
								}
							>
								<Text style={fonts.subtitle1White}>
									Week {week}
								</Text>
								<Image
									source={require("@/assets/icons/chevron_right.svg")}
									style={{ width: 40, height: 40 }}
								/>
							</Pressable>
						))}
					</ScrollView>
				</View>
			)}
		</SafeAreaView>
	);
}
