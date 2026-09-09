import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export const isNearScrollEnd = (
	event: NativeSyntheticEvent<NativeScrollEvent>,
	threshold = 120
) => {
	const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

	return (
		layoutMeasurement.height + contentOffset.y >=
		contentSize.height - threshold
	);
};

export const appendUniqueItems = <T extends { id: string | number }>(
	currentItems: T[],
	newItems: T[]
) => {
	const itemsById = new Map(
		[...currentItems, ...newItems].map((item) => [item.id, item])
	);

	return Array.from(itemsById.values());
};
