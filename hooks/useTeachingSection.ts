import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { GetTeachingParams } from "@/types/teaching";
import { appendUniqueItems } from "@/utils/paginationHelper";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

type UseTeachingSectionParams = {
	page?: number;
	limit?: number;
	sectionName: string;
};

const useTeachingSection = ({
	page = 1,
	limit = TEACHINGS_PAGE_SIZE,
	sectionName
}: UseTeachingSectionParams) => {
	const {
		setSectionTeachings,
		setIsLoadingSectionTeachings,
		setIsLoadMoreSectionTeachings,
		setSectionTeachingsPagination
	} = useTeachingStore();
	const {
		setIsFilterByBookOpen,
		setIsFilterByOtherOpen,
		selectedFilter,
		selectedBook,
		setSelectedBook,
		setSelectedFilter
	} = useTeachingFilterStore();
	const requestIdRef = useRef(0);

	useEffect(() => {
		const requestId = ++requestIdRef.current;
		setSelectedBook(null);
		setSelectedFilter(null);
		setSectionTeachings([]);
		setIsLoadMoreSectionTeachings(false);
		setIsLoadingSectionTeachings(true);
		getTeachings(
			{
				page,
				limit,
				category: sectionName
			},
			{
				onSuccess: (data) => {
					if (requestId !== requestIdRef.current) return;

					setSectionTeachings(data.data);
					setSectionTeachingsPagination(data.pagination);
				},
				onError: (error) => {
					if (requestId !== requestIdRef.current) return;

					console.log(error);
				},
				onFulfilled: () => {
					if (requestId === requestIdRef.current) {
						setIsLoadingSectionTeachings(false);
					}
				}
			}
		);

		return () => {
			if (requestId === requestIdRef.current) {
				requestIdRef.current += 1;
			}
		};
	}, [
		limit,
		page,
		sectionName,
		setIsLoadMoreSectionTeachings,
		setIsLoadingSectionTeachings,
		setSectionTeachings,
		setSectionTeachingsPagination,
		setSelectedBook,
		setSelectedFilter
	]);

	const handleRefreshSectionTeachings = useCallback(async () => {
		const requestId = ++requestIdRef.current;
		setSelectedBook(null);
		setSelectedFilter(null);
		setIsLoadMoreSectionTeachings(false);
		setIsLoadingSectionTeachings(true);

		await getTeachings(
			{
				page,
				limit,
				category: sectionName
			},
			{
				onSuccess: (data) => {
					if (requestId !== requestIdRef.current) return;

					setSectionTeachings(data.data);
					setSectionTeachingsPagination(data.pagination);
				},
				onError: (error) => {
					if (requestId !== requestIdRef.current) return;

					console.log(error);
				},
				onFulfilled: () => {
					if (requestId === requestIdRef.current) {
						setIsLoadingSectionTeachings(false);
					}
				}
			}
		);
	}, [
		limit,
		page,
		sectionName,
		setIsLoadMoreSectionTeachings,
		setIsLoadingSectionTeachings,
		setSectionTeachings,
		setSectionTeachingsPagination,
		setSelectedBook,
		setSelectedFilter
	]);

	const handleLoadMoreSectionTeachings = useCallback(async () => {
		const {
			isLoadMoreSectionTeachings,
			isLoadingSectionTeachings,
			sectionTeachingsPagination
		} = useTeachingStore.getState();

		if (
			isLoadMoreSectionTeachings ||
			isLoadingSectionTeachings ||
			sectionTeachingsPagination.page >=
				sectionTeachingsPagination.totalPages
		) {
			return;
		}

		let params: GetTeachingParams = {
			page: sectionTeachingsPagination.page + 1,
			limit,
			category: sectionName
		};

		if (selectedFilter) {
			if (selectedFilter.teachers) {
				params.teacher = selectedFilter.teachers.join(",");
			}
			if (selectedFilter.years) {
				params.year = selectedFilter.years.join(",");
			}
			if (selectedFilter.events) {
				params.event = selectedFilter.events.join(",");
			}
		}

		if (selectedBook) {
			if (selectedBook.bookName) {
				params.book = selectedBook.bookName;
			}
			if (selectedBook.chapters) {
				params.chapters = selectedBook.chapters.join(",");
			}
		}

		const requestId = requestIdRef.current;
		setIsLoadMoreSectionTeachings(true);

		await getTeachings(params, {
			onSuccess: (data) => {
				const state = useTeachingStore.getState();

				if (
					requestId !== requestIdRef.current ||
					!state.isLoadMoreSectionTeachings
				) {
					return;
				}

				setSectionTeachings(
					appendUniqueItems(state.sectionTeachings, data.data)
				);
				setSectionTeachingsPagination(data.pagination);
			},
			onError: (error) => {
				if (requestId === requestIdRef.current) {
					console.log(error);
				}
			},
			onFulfilled: () => {
				if (requestId === requestIdRef.current) {
					setIsLoadMoreSectionTeachings(false);
				}
			}
		});
	}, [
		limit,
		sectionName,
		selectedBook,
		selectedFilter,
		setIsLoadMoreSectionTeachings,
		setSectionTeachings,
		setSectionTeachingsPagination
	]);

	const handleCloseSectionTeachings = () => {
		setIsFilterByBookOpen(false);
		setIsFilterByOtherOpen(false);
		setSelectedBook(null);
		setSelectedFilter(null);
		setSectionTeachings([]);

		router.back();
	};

	return {
		handleCloseSectionTeachings,
		handleRefreshSectionTeachings,
		handleLoadMoreSectionTeachings
	};
};

export default useTeachingSection;
