import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { GetTeachingParams } from "@/types/teaching";
import { appendUniqueItems } from "@/utils/paginationHelper";
import { showErrorToast } from "@/utils/toastHelper";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

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
	} = useTeachingStore(
		useShallow((s) => ({
			setSectionTeachings: s.setSectionTeachings,
			setIsLoadingSectionTeachings: s.setIsLoadingSectionTeachings,
			setIsLoadMoreSectionTeachings: s.setIsLoadMoreSectionTeachings,
			setSectionTeachingsPagination: s.setSectionTeachingsPagination
		}))
	);
	const {
		setIsFilterByBookOpen,
		setIsFilterByOtherOpen,
		selectedFilter,
		selectedBook,
		setSelectedBook,
		setSelectedFilter
	} = useTeachingFilterStore(
		useShallow((s) => ({
			setIsFilterByBookOpen: s.setIsFilterByBookOpen,
			setIsFilterByOtherOpen: s.setIsFilterByOtherOpen,
			selectedFilter: s.selectedFilter,
			selectedBook: s.selectedBook,
			setSelectedBook: s.setSelectedBook,
			setSelectedFilter: s.setSelectedFilter
		}))
	);
	const requestIdRef = useRef(0);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const requestId = ++requestIdRef.current;
		setHasError(false);
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
					setHasError(true);
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
		setHasError(false);
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
					setHasError(true);
					if (useTeachingStore.getState().sectionTeachings.length > 0) {
						showErrorToast("Couldn't refresh. Please try again.");
					}
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
				sectionTeachingsPagination.total_pages
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
				params.teacher = selectedFilter.teachers;
			}
			if (selectedFilter.years) {
				params.year = selectedFilter.years;
			}
			if (selectedFilter.events) {
				params.event = selectedFilter.events;
			}
		}

		if (selectedBook) {
			if (selectedBook.bookName) {
				params.passage = selectedBook.bookName;
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
		hasError,
		handleCloseSectionTeachings,
		handleRefreshSectionTeachings,
		handleLoadMoreSectionTeachings
	};
};

export default useTeachingSection;
