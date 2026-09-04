import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { GetTeachingParams } from "@/types/teaching";
import { getNextChapters } from "@/utils/chapterSelector";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

const useFilterBook = () => {
	const { setSelectedBook } = useTeachingFilterStore();
	const {
		setSectionTeachings,
		setIsLoadingSectionTeachings,
		setIsLoadMoreSectionTeachings,
		setSectionTeachingsPagination
	} = useTeachingStore();
	const { name } = useLocalSearchParams<{ name?: string | string[] }>();
	const sectionName = Array.isArray(name) ? name[0] : name;

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
			const { selectedFilter } = useTeachingFilterStore.getState();
			setIsLoadMoreSectionTeachings(false);
			setIsLoadingSectionTeachings(true);

			const payload: GetTeachingParams = {
				page: 1,
				limit: TEACHINGS_PAGE_SIZE,
				category: sectionName,
				book: bookName,
				chapters: chapterNumbers.join(",")
			};

			if (selectedFilter?.teachers) {
				payload.teacher = selectedFilter.teachers.join(",");
			}
			if (selectedFilter?.years) {
				payload.year = selectedFilter.years.join(",");
			}
			if (selectedFilter?.events) {
				payload.event = selectedFilter.events.join(",");
			}

			getTeachings(payload, {
				onSuccess: (data) => {
					setSectionTeachings(data.data);
					setSectionTeachingsPagination(data.pagination);
				},
				onError: (error) => {
					console.log(error);
				},
				onFulfilled: () => {
					setIsLoadingSectionTeachings(false);
				}
			});
		},
		[
			sectionName,
			setIsLoadMoreSectionTeachings,
			setIsLoadingSectionTeachings,
			setSectionTeachings,
			setSectionTeachingsPagination
		]
	);

	return {
		handleChapterPress,
		handleSelectAllChapters,
		handleFilterTeachingByBook
	};
};

export default useFilterBook;
