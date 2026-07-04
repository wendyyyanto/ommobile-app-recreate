import BackButton from "@/components/ui/BackButton";
import { useLocalSearchParams } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";

function PdfViewer() {
	const { source } = useLocalSearchParams();

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
				<BackButton />
			</View>
			<Pdf
				source={{ uri: source as string }}
				onLoadComplete={(numberOfPages) => {
					console.log(`Number of pages: ${numberOfPages}`);
				}}
				onPageChanged={(page) => {
					console.log(`Current page: ${page}`);
				}}
				onError={(error) => {
					console.log(error);
				}}
				onPressLink={(uri) => {
					console.log(`Link pressed: ${uri}`);
				}}
				style={styles.pdf}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black"
	},
	pdf: {
		flex: 1,
		width: Dimensions.get("window").width
	}
});

export default PdfViewer;
