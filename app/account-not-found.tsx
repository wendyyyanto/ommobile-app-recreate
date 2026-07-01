import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountNotFoundScreen() {
	return (
		<ImageBackground
			source={require("@/assets/images/search_noresult.png")}
			style={{ flex: 1, backgroundColor: colors.black }}
			resizeMode="contain"
		>
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
								{ color: colors.lightSteelGray, textAlign: "center" }
							]}
						>
							No account found for this email.
						</Text>

						<View style={{ alignItems: "center", gap: 24 }}>
							<Pressable onPress={() => router.push("/register")}>
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
		</ImageBackground>
	);
}
