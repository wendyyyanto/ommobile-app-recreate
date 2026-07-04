import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
// Matches the glow's scale/position measured from the design mockup:
// displayed at ~1.54x the screen width, centered horizontally, flush top.
const GLOW_IMAGE_SIZE = SCREEN_WIDTH * 1.54;

const RESEND_SECONDS = 3;

export default function CheckEmailScreen() {
	const { email } = useLocalSearchParams<{ email?: string }>();
	const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

	useEffect(() => {
		if (secondsLeft <= 0) {
			router.replace({ pathname: "/expired-link", params: { email } });
			// router.replace("/login-loading");
		}
		const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);

		return () => clearTimeout(timer);
	}, [secondsLeft]);

	return (
		<View style={{ flex: 1, backgroundColor: colors.black }}>
			<Image
				source={require("@/assets/images/email.png")}
				style={{
					position: "absolute",
					top: 0,
					left: (SCREEN_WIDTH - GLOW_IMAGE_SIZE) / 2,
					width: GLOW_IMAGE_SIZE,
					height: GLOW_IMAGE_SIZE
				}}
				contentFit="contain"
			/>

			<SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
				<View
					style={{
						flex: 1,
						paddingHorizontal: 24,
						paddingTop: 20
					}}
				>
					<View
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
								disabled={secondsLeft > 0}
								onPress={() => setSecondsLeft(RESEND_SECONDS)}
							>
								<Text
									style={[
										fonts.body1White,
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
								</Text>
							</Pressable>
							<Pressable onPress={() => router.replace("/login")}>
								<Text style={fonts.subtitle1White}>
									Use another email
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}
