import colors from "@/constants/colors";
import { TabEnum } from "@/constants/enums";
import fonts from "@/constants/fonts";
import { COLOR_TRANSITION, EASE_IN_OUT } from "@/constants/motion";
import { useTeachingStore } from "@/stores/teachingStore";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

const TAB_WIDTH = 80;

const TeachingTab = () => {
	const {
		activeTab,
		setActiveTab
	} = useTeachingStore(
		useShallow((s) => ({
			activeTab: s.activeTab,
			setActiveTab: s.setActiveTab
		}))
	);
	const reduced = useReducedMotion();

	const selectTab = (tab: TabEnum) => {
		if (tab === activeTab) return;
		void Haptics.selectionAsync();
		setActiveTab(tab);
	};

	return (
		<View className="flex-1 flex justify-center items-center">
			<View style={styles.tabBar}>
				<MotiView
					transition={{
						type: "timing",
						duration: reduced ? 0 : 200,
						easing: EASE_IN_OUT
					}}
					animate={{
						translateX: activeTab === TabEnum.AUDIO ? 0 : TAB_WIDTH
					}}
					style={[styles.pill, { width: TAB_WIDTH }]}
				/>

				<Pressable
					className="flex-1 flex justify-center items-center z-10"
					onPress={() => selectTab(TabEnum.AUDIO)}
				>
					<Animated.Text
						style={[
							fonts.body1White,
							COLOR_TRANSITION,
							{ color: colors.slateGray },
							activeTab === TabEnum.AUDIO && {
								color: colors.white
							}
						]}
					>
						Audio
					</Animated.Text>
				</Pressable>

				<Pressable
					className="flex-1 flex justify-center items-center z-10"
					onPress={() => selectTab(TabEnum.VIDEO)}
				>
					<Animated.Text
						style={[
							COLOR_TRANSITION,
							{ color: colors.slateGray },
							activeTab === TabEnum.VIDEO && {
								color: colors.white
							}
						]}
					>
						Video
					</Animated.Text>
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
