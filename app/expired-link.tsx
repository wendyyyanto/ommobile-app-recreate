import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GLOW_IMAGE_SIZE = SCREEN_WIDTH * 1.54;

export default function ExpiredLinkScreen() {
	const { email } = useLocalSearchParams<{ email?: string }>();

	return (
		<View style={{ flex: 1, backgroundColor: colors.black }}>
			<Image
				source={require("@/assets/images/expired.png")}
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
							Your sign-in link has expired.{"\n"}
							Please request a new one.
						</Text>

						<View style={{ alignItems: "center", gap: 24 }}>
							<Pressable
								onPress={() =>
									router.replace({
										pathname: "/check-email",
										params: { email }
									})
								}
							>
								<Text style={fonts.subtitle1White}>
									Resend link
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
