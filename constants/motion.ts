import {
	cubicBezier,
	Easing,
	FadeIn,
	FadeOut,
	LinearTransition,
	ReduceMotion
} from "react-native-reanimated";

export const CSS_EASE_OUT = cubicBezier(0.23, 1, 0.32, 1) as unknown as string;
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const CONTENT_FADE = FadeIn.duration(200)
	.easing(EASE_OUT)
	.reduceMotion(ReduceMotion.Never);
export const QUICK_FADE = FadeIn.duration(150)
	.easing(EASE_OUT)
	.reduceMotion(ReduceMotion.Never);
export const QUICK_FADE_OUT = FadeOut.duration(120)
	.easing(EASE_OUT)
	.reduceMotion(ReduceMotion.Never);

export const ROW_LAYOUT = LinearTransition.duration(200).easing(EASE_OUT);

export const BACKGROUND_TRANSITION = {
	transitionProperty: "backgroundColor",
	transitionDuration: "150ms",
	transitionTimingFunction: CSS_EASE_OUT
} as const;

export const OPACITY_TRANSITION = {
	transitionProperty: "opacity",
	transitionDuration: "150ms",
	transitionTimingFunction: CSS_EASE_OUT
} as const;

export const ROTATE_TRANSITION = {
	transitionProperty: "transform",
	transitionDuration: "200ms",
	transitionTimingFunction: CSS_EASE_OUT
} as const;
