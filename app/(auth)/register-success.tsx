import PressableScale from "@/components/ui/PressableScale";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { CONTENT_FADE, EASE_OUT } from "@/constants/motion";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const riseIn = (delay: number) =>
	FadeInDown.duration(300).easing(EASE_OUT).delay(delay);

const HEADING_ENTER = riseIn(0);
const BODY_ENTER = riseIn(60);
const ACTION_ENTER = riseIn(120);

export default function RegisterSuccessScreen() {
	const reduced = useReducedMotion();

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.black }}
			edges={["top", "bottom"]}
		>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 24,
					paddingTop: 20,
					gap: 32
				}}
			>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Go back"
					style={{ width: 40, height: 40 }}
					onPress={() => router.back()}
				>
					<Image
						source={require("@/assets/icons/arrow_back.svg")}
						style={{ width: 40, height: 40 }}
					/>
				</Pressable>

				<View style={{ gap: 16 }}>
					<Animated.Text
						entering={reduced ? CONTENT_FADE : HEADING_ENTER}
						style={{
							fontSize: 30,
							fontFamily: "Poppins_400Regular",
							color: colors.white,
							lineHeight: 40
						}}
					>
						Account created
					</Animated.Text>
					<Animated.Text
						entering={reduced ? CONTENT_FADE : BODY_ENTER}
						style={[
							fonts.body1White,
							{
								color: colors.lightSteelGray
							}
						]}
					>
						Congrats! Your account has been successfully created.
						You can now log in and access the application.
					</Animated.Text>
				</View>

				<Animated.View entering={reduced ? CONTENT_FADE : ACTION_ENTER}>
					<PressableScale
						style={{
							backgroundColor: colors.white,
							borderRadius: 40,
							paddingVertical: 14,
							alignItems: "center",
							width: "100%"
						}}
						onPress={() => router.replace("/login")}
					>
						<Text
							style={{
								fontSize: 14,
								fontFamily: "Poppins_500Medium",
								color: colors.black
							}}
						>
							Back to login
						</Text>
					</PressableScale>
				</Animated.View>
			</View>
		</SafeAreaView>
	);
}
