import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useCallback } from "react";
import { getNextChapters } from "@/utils/chapterSelector";

const useFilterBook = () => {
	const setSelectedBook = useTeachingFilterStore((s) => s.setSelectedBook);

	const handleChapterPress = useCallback((bookName: string, chapter: number) => {
		const { selectedBook } = useTeachingFilterStore.getState();
		const existing = selectedBook.find(
			(item) => item.bookName === bookName
		);
		const prevChapters = existing?.chapters ?? [];

		const nextChapters = getNextChapters(prevChapters, chapter);
		const hasSelectionFromOtherBook = selectedBook.some(
			(item) => item.bookName !== bookName
		);

		// When user taps a chapter in another accordion, switch selection context
		// to that book only. Opening accordion alone doesn't touch state.
		if (hasSelectionFromOtherBook) {
			setSelectedBook(
				nextChapters.length > 0
					? [
							{
								bookName,
								chapters: nextChapters
							}
						]
					: []
			);
			return;
		}

		// If nothing remains selected, remove the book entry entirely.
		if (nextChapters.length === 0) {
			setSelectedBook(
				selectedBook.filter((item) => item.bookName !== bookName)
			);
			return;
		}

		// First selection for this book.
		if (!existing) {
			setSelectedBook([
				...selectedBook,
				{
					bookName,
					chapters: nextChapters
				}
			]);
			return;
		}

		// Update contiguous range.
		setSelectedBook(
			selectedBook.map((item) =>
				item.bookName === bookName
					? {
							...item,
							chapters: nextChapters
						}
					: item
			)
		);
	}, [setSelectedBook]);

	return { handleChapterPress };
};

export default useFilterBook;
