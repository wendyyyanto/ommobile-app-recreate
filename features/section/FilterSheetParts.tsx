import colors from "@/constants/colors";
import { EASE_OUT, QUICK_FADE, QUICK_FADE_OUT } from "@/constants/motion";
import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetFooter,
	BottomSheetFooterProps
} from "@gorhom/bottom-sheet";
import { ReactNode } from "react";
import Animated, {
	FadeInDown,
	FadeOutDown,
	useReducedMotion
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const FILTER_FOOTER_SPACE = 120;
export const FILTER_SNAP_POINTS = ["50%", "80%", "100%"];
export const FILTER_OPEN_INDEX = 1;

const FOOTER_ENTER = FadeInDown.duration(200).easing(EASE_OUT);
const FOOTER_EXIT = FadeOutDown.duration(150).easing(EASE_OUT);

export const FilterSheetBackdrop = (props: BottomSheetBackdropProps) => (
	<BottomSheetBackdrop
		{...props}
		appearsOnIndex={0}
		disappearsOnIndex={-1}
	/>
);

export const FilterSheetFooter = ({
	visible,
	children,
	...props
}: BottomSheetFooterProps & { visible: boolean; children: ReactNode }) => {
	const insets = useSafeAreaInsets();
	const reduced = useReducedMotion();

	return (
		<BottomSheetFooter {...props} bottomInset={insets.bottom}>
			{visible && (
				<Animated.View
					entering={reduced ? QUICK_FADE : FOOTER_ENTER}
					exiting={reduced ? QUICK_FADE_OUT : FOOTER_EXIT}
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: colors.black,
						paddingVertical: 16,
						paddingHorizontal: 40,
						gap: 40
					}}
				>
					{children}
				</Animated.View>
			)}
		</BottomSheetFooter>
	);
};
