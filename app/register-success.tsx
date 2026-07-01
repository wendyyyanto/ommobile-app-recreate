import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterSuccessScreen() {
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
							fontSize: 30,
							fontFamily: "Poppins_400Regular",
							color: colors.white,
							lineHeight: 40
						}}
					>
						Account created
					</Text>
					<Text
						style={[
							fonts.body1White,
							{
								color: colors.lightSteelGray
							}
						]}
					>
						Our administrator will review your request and send you
						an email once a decision has been made.
					</Text>
					<Text
						style={[
							fonts.body1White,
							{
								color: colors.lightSteelGray
							}
						]}
					>
						Please check your inbox for updates.
					</Text>
				</View>

				<Pressable
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
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
