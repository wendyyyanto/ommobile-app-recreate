import { getSearchTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { useEffect, useRef } from "react";

const useSearchTeachings = () => {
	const {
		setSearchTeachings,
		setIsLoadingSearchTeachings,
		setSearchQuery,
		searchQuery
	} = useTeachingStore();
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setSearchTeachings([]);
			setIsLoadingSearchTeachings(false);
			return;
		}

		setIsLoadingSearchTeachings(true);
		getSearchTeachings(
			{
				page: 1,
				limit: 100,
				q: searchQuery
			},
			{
				onSuccess: (data) => {
					setSearchTeachings(data.data);
					setIsLoadingSearchTeachings(false);
				},
				onError: (error) => {
					console.log(error);
					setIsLoadingSearchTeachings(false);
				}
			}
		);
	}, [searchQuery, setIsLoadingSearchTeachings, setSearchTeachings]);

	const handleSearchTeachings = (query: string) => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		debounceTimeoutRef.current = setTimeout(() => {
			setSearchQuery(query);
		}, 500);
	};

	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	return { handleSearchTeachings };
};

export default useSearchTeachings;
