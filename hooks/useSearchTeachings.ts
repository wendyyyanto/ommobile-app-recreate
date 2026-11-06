import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { appendUniqueItems } from "@/utils/paginationHelper";
import { showErrorToast } from "@/utils/toastHelper";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const useSearchTeachings = () => {
	const {
		setSearchTeachings,
		setIsLoadingSearchTeachings,
		setSearchQuery,
		searchQuery,
		setIsLoadMoreSearchTeachings,
		setSearchTeachingsPagination
	} = useTeachingStore(
		useShallow((s) => ({
			setSearchTeachings: s.setSearchTeachings,
			setIsLoadingSearchTeachings: s.setIsLoadingSearchTeachings,
			setSearchQuery: s.setSearchQuery,
			searchQuery: s.searchQuery,
			setIsLoadMoreSearchTeachings: s.setIsLoadMoreSearchTeachings,
			setSearchTeachingsPagination: s.setSearchTeachingsPagination
		}))
	);
	const [hasError, setHasError] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const requestIdRef = useRef(0);

	useEffect(() => {
		const requestId = ++requestIdRef.current;
		setHasError(false);
		setIsLoadMoreSearchTeachings(false);

		if (!searchQuery.trim()) {
			setSearchTeachings([]);
			setIsLoadingSearchTeachings(false);
			setSearchTeachingsPagination({
				page: 1,
				limit: TEACHINGS_PAGE_SIZE,
				total_items: 0,
				total_pages: 1
			});
			return;
		}

		setIsLoadingSearchTeachings(true);
		getTeachings(
			{
				page: 1,
				limit: TEACHINGS_PAGE_SIZE,
				q: searchQuery
			},
			{
				onSuccess: (data) => {
					if (requestId !== requestIdRef.current) return;

					setSearchTeachings(data.data);
					setSearchTeachingsPagination(data.pagination);
				},
				onError: (error) => {
					if (requestId !== requestIdRef.current) return;

					console.log(error);
					setSearchTeachings([]);
					setHasError(true);
				},
				onFulfilled: () => {
					if (requestId === requestIdRef.current) {
						setIsLoadingSearchTeachings(false);
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
		searchQuery,
		retryCount,
		setIsLoadMoreSearchTeachings,
		setIsLoadingSearchTeachings,
		setSearchTeachings,
		setSearchTeachingsPagination
	]);

	const handleSearchTeachings = (query: string) => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		debounceTimeoutRef.current = setTimeout(() => {
			setSearchQuery(query);
		}, 500);
	};

	const handleLoadMoreSearchTeachings = useCallback(async () => {
		const {
			isLoadMoreSearchTeachings,
			isLoadingSearchTeachings,
			searchQuery,
			searchTeachingsPagination
		} = useTeachingStore.getState();

		if (
			!searchQuery.trim() ||
			isLoadMoreSearchTeachings ||
			isLoadingSearchTeachings ||
			searchTeachingsPagination.page >=
				searchTeachingsPagination.total_pages
		) {
			return;
		}

		const requestId = requestIdRef.current;
		setIsLoadMoreSearchTeachings(true);

		await getTeachings(
			{
				page: searchTeachingsPagination.page + 1,
				limit: TEACHINGS_PAGE_SIZE,
				q: searchQuery
			},
			{
				onSuccess: (data) => {
					if (requestId !== requestIdRef.current) return;

					const currentTeachings =
						useTeachingStore.getState().searchTeachings;
					setSearchTeachings(
						appendUniqueItems(currentTeachings, data.data)
					);
					setSearchTeachingsPagination(data.pagination);
				},
				onError: (error) => {
					if (requestId === requestIdRef.current) {
						console.log(error);
						showErrorToast("Couldn't load more results. Please try again.");
					}
				},
				onFulfilled: () => {
					if (requestId === requestIdRef.current) {
						setIsLoadMoreSearchTeachings(false);
					}
				}
			}
		);
	}, [
		setIsLoadMoreSearchTeachings,
		setSearchTeachings,
		setSearchTeachingsPagination
	]);

	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	const handleRetrySearch = useCallback(() => setRetryCount((n) => n + 1), []);

	return {
		hasError,
		handleSearchTeachings,
		handleLoadMoreSearchTeachings,
		handleRetrySearch
	};
};

export default useSearchTeachings;
