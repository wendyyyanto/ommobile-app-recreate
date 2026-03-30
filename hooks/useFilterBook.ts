import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { getNextChapters } from "@/utils/chapterSelector";

const useFilterBook = () => {
	const { selectedBook, setSelectedBook } = useTeachingFilterStore();

	const handleChapterPress = (bookName: string, chapter: number) => {
		const existing = selectedBook.find(
			(item) => item.bookName === bookName
		);
		const prevChapters = existing?.chapters ?? [];

		const nextChapters = getNextChapters(prevChapters, chapter);

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
	};

	const handleOnAccordionClosed = (bookName: string) => {
		setSelectedBook(
			selectedBook.filter((item) => item.bookName !== bookName)
		);
	};

	return { handleChapterPress, handleOnAccordionClosed };
};

export default useFilterBook;
