import { Text, View } from "react-native";
import { Sheet } from "tamagui";

const SectionBookFilterDropdown = () => {
	return (
		<View className="flex-1">
			<Sheet
				open={true}
				onOpenChange={() => {}}
				snapPoints={[85, 50]}
				snapPointsMode="percent"
				dismissOnSnapToBottom
				position={0}
				zIndex={100_000}
			>
				<Sheet.Overlay
					transition="lazy"
					className="bg-slate-gray"
					enterStyle={{ opacity: 0 }}
					exitStyle={{ opacity: 0 }}
				/>

				<Sheet.Handle />
				<Sheet.Frame className="p-4 justify-center items-center gap-5">
					<View>
						<Text>Hello</Text>
					</View>
				</Sheet.Frame>
			</Sheet>
		</View>
	);
};

export default SectionBookFilterDropdown;
