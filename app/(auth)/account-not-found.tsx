import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
// Measured from the design: the glow graphic renders at ~1.54x the screen
// width (overflowing/cropping left and right), centered horizontally and
// flush with the very top of the screen.
const GLOW_IMAGE_SIZE = SCREEN_WIDTH * 1.54;

export default function AccountNotFoundScreen() {
	return (
		<View style={{ flex: 1, backgroundColor: colors.black }}>
			<Image
				source={require("@/assets/images/search_noresult.png")}
				style={{
					position: "absolute",
					top: 35,
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
					<Pressable
						style={{ width: 40, height: 40 }}
						onPress={() => router.back()}
					>
						<Image
							source={require("@/assets/icons/arrow_back.svg")}
							style={{ width: 40, height: 40 }}
						/>
					</Pressable>

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
							No account found for this email.
						</Text>

						<View style={{ alignItems: "center", gap: 24 }}>
							<Pressable
								onPress={() => router.replace("/register")}
							>
								<Text style={fonts.subtitle1White}>
									Create Account
								</Text>
							</Pressable>
							<Pressable onPress={() => router.back()}>
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
