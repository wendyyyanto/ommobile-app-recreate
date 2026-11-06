import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { COLOR_TRANSITION, CONTENT_FADE, EASE_OUT } from "@/constants/motion";
import { login } from "@/services/authServices";
import { showErrorToast, showSuccessToast } from "@/utils/toastHelper";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
	FadeIn,
	Keyframe,
	useReducedMotion
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
// Matches the glow's scale/position measured from the design mockup:
// displayed at ~1.54x the screen width, centered horizontally, flush top.
const GLOW_IMAGE_SIZE = SCREEN_WIDTH * 1.54;

const RESEND_SECONDS = 60;

const GLOW_ENTER = new Keyframe({
	from: { opacity: 0, transform: [{ scale: 0.97 }] },
	to: { opacity: 1, transform: [{ scale: 1 }], easing: EASE_OUT }
}).duration(400);
const TEXT_ENTER = FadeIn.duration(300).easing(EASE_OUT).delay(100);

export default function CheckEmailScreen() {
	const { email } = useLocalSearchParams<{ email?: string }>();
	const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
	const [isResending, setIsResending] = useState(false);
	const reduced = useReducedMotion();

	useEffect(() => {
		// countdown only gates "Resend"; signing in happens solely via the emailed magic link
		if (secondsLeft <= 0) return;
		const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);

		return () => clearTimeout(timer);
	}, [secondsLeft]);

	const handleResend = () => {
		if (!email || isResending) return;
		setIsResending(true);
		login(
			{ email },
			{
				onSuccess: () => {
					void Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					);
					setSecondsLeft(RESEND_SECONDS);
					showSuccessToast("Sign-in link sent");
				},
				onError: (error) =>
					showErrorToast(
						error?.response?.data?.message ??
							"Something went wrong. Please try again."
					),
				onFulfilled: () => setIsResending(false)
			}
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: colors.black }}>
			<Animated.View
				entering={reduced ? CONTENT_FADE : GLOW_ENTER}
				style={{
					position: "absolute",
					top: 0,
					left: (SCREEN_WIDTH - GLOW_IMAGE_SIZE) / 2,
					width: GLOW_IMAGE_SIZE,
					height: GLOW_IMAGE_SIZE
				}}
			>
				<Image
					source={require("@/assets/images/email.webp")}
					style={{ width: "100%", height: "100%" }}
					contentFit="contain"
				/>
			</Animated.View>

			<SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
				<View
					style={{
						flex: 1,
						paddingHorizontal: 24,
						paddingTop: 20
					}}
				>
					<Animated.View
						entering={reduced ? CONTENT_FADE : TEXT_ENTER}
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							gap: 56
						}}
					>
						<Text
							style={[
								fonts.body1White,
								{
									color: colors.lightSteelGray,
									textAlign: "center"
								}
							]}
						>
							We&apos;ve sent a secure sign-in link to{"\n"}
							{email}
						</Text>

						<View style={{ alignItems: "center", gap: 24 }}>
							<Pressable
								className="active:opacity-70"
								disabled={secondsLeft > 0 || isResending}
								onPress={handleResend}
							>
								<Animated.Text
									style={[
										fonts.body1White,
										COLOR_TRANSITION,
										{
											color:
												secondsLeft > 0
													? colors.lightSteelGray
													: colors.white
										}
									]}
								>
									Resend link
									<Text style={fonts.body1White}>
										{secondsLeft > 0
											? `  ${secondsLeft}`
											: ""}
									</Text>
								</Animated.Text>
							</Pressable>
							<Pressable
								className="active:opacity-70"
								onPress={() => router.replace("/login")}
							>
								<Text style={fonts.subtitle1White}>
									Use another email
								</Text>
							</Pressable>
						</View>
					</Animated.View>
				</View>
			</SafeAreaView>
		</View>
	);
}
