import { createAnimations } from "@tamagui/animations-react-native";
import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

const config: ReturnType<typeof createTamagui> = createTamagui({
	...defaultConfig,
    animations: createAnimations({
		default: {
			damping: 20,
			mass: 1.2,
			stiffness: 250
		},
		bouncy: {
			damping: 10,
			mass: 0.9,
			stiffness: 100
		},
		lazy: {
			damping: 18,
			stiffness: 50
		},
		quick: {
			damping: 20,
			mass: 1.2,
			stiffness: 250
		}
	}) as any,
	media: {
		...defaultConfig.media
	},
	
});

type OurConfig = typeof config;

declare module "tamagui" {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface TamaguiCustomConfig extends OurConfig {}
}

export default config;
