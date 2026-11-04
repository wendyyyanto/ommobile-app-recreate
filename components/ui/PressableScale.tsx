import { CSS_EASE_OUT } from "@/constants/motion";
import { cssInterop } from "nativewind";
import { useState } from "react";
import {
	Pressable,
	PressableProps,
	StyleProp,
	StyleSheet,
	ViewStyle
} from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
cssInterop(AnimatedPressable, { className: "style" });

type PressableScaleProps = Omit<PressableProps, "style"> & {
	className?: string;
	style?: StyleProp<ViewStyle>;
};

const PressableScale = ({
	onPressIn,
	onPressOut,
	style,
	...props
}: PressableScaleProps) => {
	const [pressed, setPressed] = useState(false);
	const reduced = useReducedMotion();

	return (
		<AnimatedPressable
			{...props}
			onPressIn={(event) => {
				setPressed(true);
				onPressIn?.(event);
			}}
			onPressOut={(event) => {
				setPressed(false);
				onPressOut?.(event);
			}}
			style={[
				styles.base,
				style,
				pressed && (reduced ? styles.pressedDimmed : styles.pressedScaled)
			]}
		/>
	);
};

const styles = StyleSheet.create({
	base: {
		opacity: 1,
		transform: [{ scale: 1 }],
		transitionProperty: ["transform", "opacity"],
		transitionDuration: "120ms",
		transitionTimingFunction: CSS_EASE_OUT
	},
	pressedScaled: {
		transform: [{ scale: 0.97 }]
	},
	pressedDimmed: {
		opacity: 0.7
	}
});

export default PressableScale;
