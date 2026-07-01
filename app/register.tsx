import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.black }}
			edges={["top", "bottom"]}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
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
						style={{ width: 40, height: 40 }}
						onPress={() => router.back()}
					>
						<Image
							source={require("@/assets/icons/arrow_back.svg")}
							style={{ width: 40, height: 40 }}
						/>
					</Pressable>

					<View style={{ gap: 16 }}>
						<Text
							style={{
								width: "70%",
								fontSize: 30,
								fontFamily: "Poppins_400Regular",
								color: colors.white,
								lineHeight: 40
							}}
						>
							Create new account
						</Text>
						<Text
							style={[
								fonts.body1White,
								{
									color: colors.lightSteelGray
								}
							]}
						>
							Submit your information to request access.
						</Text>
						<Text
							style={[
								fonts.body1White,
								{
									color: colors.lightSteelGray
								}
							]}
						>
							Your registration will be reviewed by our administrator.
							Once approved, you&apos;ll receive a confirmation email
							with instructions to sign in.
						</Text>
					</View>

					<View style={{ gap: 24 }}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 8,
								paddingVertical: 8,
								borderBottomWidth: 0.5,
								borderColor: colors.lightSteelGray
							}}
						>
							<Image
								source={require("@/assets/icons/user_icon.svg")}
								style={{ width: 14, height: 14 }}
							/>
							<TextInput
								placeholder="Full Name"
								placeholderTextColor={colors.lightSteelGray}
								style={{
									flex: 1,
									fontSize: 14,
									fontFamily: "Poppins_400Regular",
									color: colors.white
								}}
								textAlignVertical="center"
								autoCapitalize="words"
							/>
						</View>

						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 8,
								paddingVertical: 8,
								borderBottomWidth: 0.5,
								borderColor: colors.lightSteelGray
							}}
						>
							<Image
								source={require("@/assets/icons/mail_icon.svg")}
								style={{ width: 14, height: 14 }}
							/>
							<TextInput
								placeholder="Email address"
								placeholderTextColor={colors.lightSteelGray}
								style={{
									flex: 1,
									fontSize: 14,
									fontFamily: "Poppins_400Regular",
									color: colors.white
								}}
								textAlignVertical="center"
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
							/>
						</View>
					</View>

					<View style={{ gap: 24, marginTop: 8 }}>
						<Pressable
							style={{
								backgroundColor: colors.white,
								borderRadius: 40,
								paddingVertical: 14,
								alignItems: "center",
								width: "100%"
							}}
							onPress={() => router.push("/register-success")}
						>
							<Text
								style={{
									fontSize: 14,
									fontFamily: "Poppins_500Medium",
									color: colors.black
								}}
							>
								Submit
							</Text>
						</Pressable>

						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								gap: 4
							}}
						>
							<Text
								style={{
									fontSize: 14,
									fontFamily: "Poppins_400Regular",
									color: colors.lightSteelGray
								}}
							>
								Already have an account?
							</Text>
							<Pressable onPress={() => router.replace("/login")}>
								<Text
									style={{
										fontSize: 14,
										fontFamily: "Poppins_400Regular",
										color: colors.lightBlue
									}}
								>
									Login
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
