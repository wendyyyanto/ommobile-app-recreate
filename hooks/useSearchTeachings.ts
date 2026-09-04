import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { getSearchTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { appendUniqueItems } from "@/utils/paginationHelper";
import { useCallback, useEffect, useRef } from "react";

const useSearchTeachings = () => {
	const {
		setSearchTeachings,
		setIsLoadingSearchTeachings,
		setSearchQuery,
		searchQuery,
		setIsLoadMoreSearchTeachings,
		setSearchTeachingsPagination
	} = useTeachingStore();
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const requestIdRef = useRef(0);

	useEffect(() => {
		const requestId = ++requestIdRef.current;
		setIsLoadMoreSearchTeachings(false);

		if (!searchQuery.trim()) {
			setSearchTeachings([]);
			setIsLoadingSearchTeachings(false);
			setSearchTeachingsPagination({
				page: 1,
				limit: TEACHINGS_PAGE_SIZE,
				totalPages: 1
			});
			return;
		}

		setSearchTeachings([]);
		setIsLoadingSearchTeachings(true);
		getSearchTeachings(
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
				searchTeachingsPagination.totalPages
		) {
			return;
		}

		const requestId = requestIdRef.current;
		setIsLoadMoreSearchTeachings(true);

		await getSearchTeachings(
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

	return { handleSearchTeachings, handleLoadMoreSearchTeachings };
};

export default useSearchTeachings;
