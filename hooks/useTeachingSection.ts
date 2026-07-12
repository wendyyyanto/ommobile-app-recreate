import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { GetTeachingParams, Teaching } from "@/types/teaching";
import { router } from "expo-router";
import { useEffect } from "react";

type UseTeachingSectionParams = {
	page?: number;
	limit?: number;
	sectionName: string;
};

const useTeachingSection = ({
	page = 1,
	limit = 10,
	sectionName
}: UseTeachingSectionParams) => {
	const {
		setSectionTeachings,
		setIsLoadingSectionTeachings,
		setIsLoadMoreSectionTeachings,
		sectionTeachingsPagination,
		sectionTeachings,
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

	const fetchSectionTeachings = (
		params: GetTeachingParams,
		setIsLoading: (isLoading: boolean) => void,
		merge: (existing: Teaching[], incoming: Teaching[]) => Teaching[]
	) => {
		setIsLoading(true);
		getTeachings(params, {
			onSuccess: (data) => {
				setSectionTeachings(merge(sectionTeachings, data.data));
				setSectionTeachingsPagination({
					page: data.pagination.page,
					limit: data.pagination.limit,
					totalPages: data.pagination.totalPages
				});
				setIsLoading(false);
			},
			onError: (error) => {
				console.log(error);
				setIsLoading(false);
			}
		});
	};

	useEffect(() => {
		fetchSectionTeachings(
			{ page: 1, limit: 10, category: sectionName },
			setIsLoadingSectionTeachings,
			(_, incoming) => incoming
		);
	}, []);

	const handleRefreshSectionTeachings = () => {
		setSelectedBook(null);
		setSelectedFilter(null);
		fetchSectionTeachings(
			{ page: 1, limit: 10, category: sectionName },
			setIsLoadingSectionTeachings,
			(_, incoming) => incoming
		);
	};

	const handleLoadMoreSectionTeachings = () => {
		if (
			sectionTeachingsPagination.page <
			sectionTeachingsPagination.totalPages
		) {
			let params: GetTeachingParams = {
				page: sectionTeachingsPagination.page + 1,
				limit: sectionTeachingsPagination.limit,
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

			fetchSectionTeachings(
				params,
				setIsLoadMoreSectionTeachings,
				(existing, incoming) => [...existing, ...incoming]
			);
		}
	};

	const handleCloseSectionTeachings = () => {
		setIsFilterByBookOpen(false);
		setIsFilterByOtherOpen(false);
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
