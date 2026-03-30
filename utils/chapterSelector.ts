const buildRange = (start: number, end: number) => {
	const from = Math.min(start, end);
	const to = Math.max(start, end);
	return Array.from({ length: to - from + 1 }, (_, i) => from + i);
};

/**
 * Given the previously selected (contiguous) chapters and a tapped chapter,
 * returns the next (contiguous) chapters.
 *
 * Behavior:
 * - If tapped chapter is not selected yet: expand range to include it.
 * - If tapped chapter is selected:
 *   - tapping any selected chapter shrinks to `min..tapped`
 *   - exception: if tapped chapter is the current max endpoint, it is removed (`min..max-1`)
 * - If the selection becomes empty, returns [].
 */
export const getNextChapters = (
	prevChapters: number[] = [],
	tappedChapter: number
) => {
	if (prevChapters.length === 0) return [tappedChapter];

	const currentMin = Math.min(...prevChapters);
	const currentMax = Math.max(...prevChapters);
	const isSelected = prevChapters.includes(tappedChapter);

	// Expand if tapping a not-selected chapter.
	if (!isSelected) {
		return buildRange(
			Math.min(currentMin, tappedChapter),
			Math.max(currentMax, tappedChapter)
		);
	}

	// If tapping the same single selected chapter: toggle it off.
	if (currentMin === currentMax) return [];

	// If user taps a chapter already selected inside a multi-chapter range:
	// - keep the lower endpoint (`currentMin`)
	// - shrink the upper endpoint to the tapped chapter
	// - exception: if tapped chapter is exactly the upper endpoint (`currentMax`),
	//   drop it (deselect only that max chapter).
	if (tappedChapter === currentMax) {
		return buildRange(currentMin, currentMax - 1);
	}

	return buildRange(currentMin, tappedChapter);
};

