import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { getNextChapters } from "@/utils/chapterSelector";
import { useCallback } from "react";

const useFilterBook = () => {
	const { setSelectedBook } = useTeachingFilterStore();
	const { setSectionTeachings, setIsLoadingSectionTeachings } =
		useTeachingStore();

	const handleChapterPress = useCallback(
		(bookName: string, chapter: number) => {
			const { selectedBook } = useTeachingFilterStore.getState();
			const nextChapters = getNextChapters(
				selectedBook?.chapters,
				chapter
			);

			// If nothing remains selected, remove the book entry entirely.
			if (nextChapters.length === 0) {
				setSelectedBook(null);
				return;
			}

			setSelectedBook({
				bookName,
				chapters: nextChapters
			});
		},
		[setSelectedBook]
	);

	const handleSelectAllChapters = useCallback(
		(totalChapters: number) => {
			const { selectedBook } = useTeachingFilterStore.getState();
			const book = selectedBook?.bookName;
			const chapterNumbers = Array.from(
				{ length: totalChapters },
				(_, index) => index + 1
			);
			setSelectedBook({
				bookName: book ?? "",
				chapters: chapterNumbers
			});
		},
		[setSelectedBook]
	);

	const handleFilterTeachingByBook = useCallback(
		(bookName: string, chapterNumbers: number[]) => {
			setIsLoadingSectionTeachings(true);

			const payload = {
				book: bookName,
				chapters: chapterNumbers.join(",")
			};
			getTeachings(payload, {
				onSuccess: (data) => {
					setSectionTeachings(data.data);
					setIsLoadingSectionTeachings(false);
				},
				onError: (error) => {
					console.log(error);
					setIsLoadingSectionTeachings(false);
				}
			});
		},
		[setSectionTeachings, setIsLoadingSectionTeachings]
	);

	return {
		handleChapterPress,
		handleSelectAllChapters,
		handleFilterTeachingByBook
	};
};

export default useFilterBook;
