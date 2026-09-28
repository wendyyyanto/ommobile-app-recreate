import LoadingSpinner from "@/components/ui/LoadingSpinner";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { getClasses } from "@/services/classServices";
import { ClassSummary } from "@/types/class";

export default function ClassMaterialsScreen() {
	const [classes, setClasses] = useState<ClassSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");

	// Debounced search; cleanup cancels the pending timer and ignores stale responses.
	useEffect(() => {
		let ignore = false;
		const timeout = setTimeout(
			() => {
				setIsLoading(true);
				void getClasses(query, {
					onSuccess: (response) => !ignore && setClasses(response.data),
					onError: (error) => console.log(error),
					onFulfilled: () => !ignore && setIsLoading(false)
				});
			},
			query ? 500 : 0
		);
		return () => {
			ignore = true;
			clearTimeout(timeout);
		};
	}, [query]);

	// Group by category, keeping the API's newest-first order within each group.
	const classMaterialsList = useMemo(() => {
		const groups = new Map<
			number,
			{ category: string; classes: ClassSummary[] }
		>();
		for (const classItem of classes) {
			const { id, label } = classItem.class_category;
			if (!groups.has(id)) groups.set(id, { category: label, classes: [] });
			groups.get(id)!.classes.push(classItem);
		}
		return [...groups.values()];
	}, [classes]);

	return (
		<SafeAreaView edges={["top"]} className="flex-1 flex-col gap-7 px-4 py-5">
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
				<Text style={fonts.body2White}>Class Materials</Text>
			</View>
			<View
				className="flex-row items-center gap-2 py-2"
				style={{
					borderBottomWidth: 0.5,
					borderColor: colors.lightSteelGray
				}}
			>
				<Image
					source={require("@/assets/icons/search_icon.svg")}
					style={{ width: 14, height: 14 }}
				/>
				<TextInput
					placeholder="Search class..."
					placeholderTextColor={colors.lightSteelGray}
					style={[fonts.body1White]}
					className="w-full"
					textAlignVertical="center"
					value={query}
					onChangeText={setQuery}
				/>
			</View>
			{isLoading ? (
				<View className="flex-1 justify-center">
					<LoadingSpinner />
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className="flex-1 pb-8 gap-3">
						{classMaterialsList.length === 0 && (
							<Text style={fonts.caption1Grey} className="text-center">
								{query ? "No classes found." : "No classes available."}
							</Text>
						)}
						{classMaterialsList.map((item) => (
							<View key={item.category}>
								<Text style={fonts.subtitle1White} className="mb-2">
									{item.category}
								</Text>
								<View className="flex gap-3">
									{item.classes.map((classItem) => (
										<Pressable
											key={classItem.id}
											className="flex flex-col gap-1 px-4 py-3 bg-charcoal-blue rounded-2xl"
											onPress={() =>
												router.push({
													pathname: "/class-materials/[id]",
													params: {
														id: classItem.id,
														title: classItem.title,
														totalWeeks: classItem.total_weeks
													}
												})
											}
										>
											<Text style={fonts.subtitle1White}>
												{classItem.title}
											</Text>
											<Text style={fonts.caption1Grey}>
												{classItem.total_weeks} Weeks
											</Text>
										</Pressable>
									))}
								</View>
							</View>
						))}
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
}
