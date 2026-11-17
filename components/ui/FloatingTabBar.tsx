import PressableScale from "@/components/ui/PressableScale";
import colors from "@/constants/colors";
import {
	BACKGROUND_TRANSITION,
	CONTENT_FADE,
	QUICK_FADE_OUT,
	ROW_LAYOUT
} from "@/constants/motion";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const icons: Record<string, { active: number; inactive: number }> = {
	index: {
		active: require("@/assets/icons/home_active.svg"),
		inactive: require("@/assets/icons/home_inactive.svg")
	},
	teachings: {
		active: require("@/assets/icons/teaching_active.svg"),
		inactive: require("@/assets/icons/teaching_inactive.svg")
	},
	notifications: {
		active: require("@/assets/icons/notif_active.svg"),
		inactive: require("@/assets/icons/notif_inactive.svg")
	}
};

const inactiveTint = "#A3ADBB";

export const TAB_BAR_SPACE = 120;

const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
	const insets = useSafeAreaInsets();

	return (
		<View
			pointerEvents="box-none"
			className="absolute bottom-0 left-0 right-0 items-center pt-2"
			style={{ paddingBottom: Math.max(insets.bottom, 16) }}
		>
			<LinearGradient
				pointerEvents="none"
				colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.9)", "black", "black"]}
				locations={[0, 0.5, 0.66, 1]}
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: 128
				}}
			/>
			<View
				className="flex-row gap-1 p-1.5 rounded-full border border-dark-slate-blue bg-charcoal-blue"
				style={{
					shadowColor: "black",
					shadowOpacity: 0.5,
					shadowRadius: 24,
					shadowOffset: { width: 0, height: 8 },
					elevation: 12
				}}
			>
				{state.routes.map((route, index) => {
					const focused = state.index === index;
					const { options } = descriptors[route.key];
					const label = options.title ?? route.name;
					const icon = icons[route.name];

					const onPress = () => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true
						});
						if (!focused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params);
						}
					};

					return (
						<Animated.View
							key={route.key}
							layout={ROW_LAYOUT}
							className="overflow-hidden rounded-full"
							style={[
								BACKGROUND_TRANSITION,
								{
									backgroundColor: focused
										? "rgba(96,207,255,0.14)"
										: "rgba(96,207,255,0)"
								}
							]}
						>
							<PressableScale
								accessibilityRole="tab"
								accessibilityLabel={label}
								accessibilityState={{ selected: focused }}
								onPress={onPress}
								className="h-[52px] min-w-[56px] flex-row items-center justify-center rounded-full"
								style={{
									paddingLeft: focused ? 16 : 0,
									paddingRight: focused ? 18 : 0,
									gap: 8
								}}
							>
								<Image
									source={focused ? icon.active : icon.inactive}
									tintColor={focused ? colors.lightBlue : inactiveTint}
									transition={150}
									style={{ width: 24, height: 24 }}
								/>
								{focused && (
									<Animated.View
										entering={CONTENT_FADE}
										exiting={QUICK_FADE_OUT}
									>
										<Text
											numberOfLines={1}
											className="text-[12px]"
											style={{
												color: colors.lightBlue,
												fontFamily: "Poppins_500Medium"
											}}
										>
											{label}
										</Text>
									</Animated.View>
								)}
							</PressableScale>
						</Animated.View>
					);
				})}
			</View>
		</View>
	);
};

export default FloatingTabBar;
