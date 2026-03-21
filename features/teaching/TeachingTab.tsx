import colors from "@/constants/colors";
import { TabEnum } from "@/constants/enums";
import fonts from "@/constants/fonts";
import { useTeachingStore } from "@/stores/teachingStore";
import { MotiView } from "moti";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TAB_WIDTH = 80;

const TeachingTab = () => {
	const { activeTab, setActiveTab } = useTeachingStore();

	return (
		<View className="flex-1 flex justify-center items-center">
			<View style={styles.tabBar}>
				<MotiView
					transition={{ type: "spring", duration: 250 }}
					animate={{
						translateX: activeTab === TabEnum.AUDIO ? 0 : TAB_WIDTH
					}}
					style={[styles.pill, { width: TAB_WIDTH }]}
				/>

				<Pressable
					className="flex-1 flex justify-center items-center z-10"
					onPress={() => setActiveTab(TabEnum.AUDIO)}
				>
					<Text
						style={[
							fonts.body1White,
							{ color: colors.slateGray },
							activeTab === TabEnum.AUDIO && {
								color: colors.white
							}
						]}
					>
						Audio
					</Text>
				</Pressable>

				<Pressable
					className="flex-1 flex justify-center items-center z-10"
					onPress={() => setActiveTab(TabEnum.VIDEO)}
				>
					<Text
						style={[
							{ color: colors.slateGray },
							activeTab === TabEnum.VIDEO && {
								color: colors.white
							}
						]}
					>
						Video
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	tabBar: {
		flexDirection: "row",
		height: 40,
		width: TAB_WIDTH * 2,
		borderRadius: 24,
		position: "relative",
		overflow: "hidden"
	},
	pill: {
		position: "absolute",
		height: "100%",
		backgroundColor: "#4a5b73",
		borderRadius: 24
	}
});

export default TeachingTab;
