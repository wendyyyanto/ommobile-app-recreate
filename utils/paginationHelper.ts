export const appendUniqueItems = <T extends { id: string | number }>(
	currentItems: T[],
	newItems: T[]
) => {
	const itemsById = new Map(
		[...currentItems, ...newItems].map((item) => [item.id, item])
	);

	return Array.from(itemsById.values());
};
