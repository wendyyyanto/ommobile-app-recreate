import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { login } from "@/services/authServices";
import { showErrorToast } from "@/utils/toastHelper";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = () => {
		const trimmedEmail = email.trim();
		if (!trimmedEmail) {
			showErrorToast("Please enter your email.");
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			showErrorToast("Please enter a valid email address.");
			return;
		}

		setIsLoading(true);
		login(
			{ email: trimmedEmail },
			{
				onSuccess: () =>
					router.push({
						pathname: "/check-email",
						params: { email: trimmedEmail }
					}),
				onError: (error) => {
					const message = error?.response?.data?.message;
					// "Your account is not approved by admin yet": registered but pending admin approval; stay on login
					if (message?.includes("not approved"))
						showErrorToast(
							message,
							"Please contact the admin to get your account approved."
						);
					else if (error?.response?.status === 404)
						router.push("/account-not-found");
					else
						showErrorToast(
							message ?? "Something went wrong. Please try again."
						);
				},
				onFulfilled: () => setIsLoading(false)
			}
		);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.black }}
			edges={["top", "bottom"]}
		>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 24,
					paddingTop: 72,
					gap: 32
				}}
			>
				<View style={{ gap: 16 }}>
					<Text
						style={{
							width: "80%",
							fontSize: 30,
							fontFamily: "Poppins_400Regular",
							color: colors.white,
							lineHeight: 40
						}}
					>
						Login to your account
					</Text>
					<Text
						style={[
							fonts.body1White,
							{
								color: colors.lightSteelGray
							}
						]}
					>
						Enter your email and we&apos;ll send you a
						secure sign-in link.
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
							source={require("@/assets/icons/mail_icon.svg")}
							style={{ width: 14, height: 14 }}
						/>
						<TextInput
							value={email}
							onChangeText={(text) => {
								setEmail(text);
							}}
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
							onSubmitEditing={handleLogin}
						/>
					</View>

				</View>

				<View style={{ gap: 40 }}>
					<Pressable
						style={{
							backgroundColor: colors.white,
							borderRadius: 40,
							paddingVertical: 14,
							alignItems: "center",
							opacity: isLoading ? 0.5 : 1,
							width: "100%"
						}}
						disabled={isLoading}
						onPress={handleLogin}
					>
						<Text
							style={{
								fontSize: 14,
								fontFamily: "Poppins_500Medium",
								color: colors.black
							}}
						>
							{isLoading ? "Sending link..." : "Continue"}
						</Text>
					</Pressable>

					<Pressable
						style={{ alignItems: "center" }}
						onPress={() => router.push("/register")}
					>
						<Text
							style={{
								fontSize: 14,
								fontFamily: "Poppins_400Regular",
								color: colors.white
							}}
						>
							Create new account
						</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}
