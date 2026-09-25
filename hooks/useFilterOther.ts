import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { getDropdowns } from "@/services/dropdownServices";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { GetTeachingParams } from "@/types/teaching";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";

const useFilterOther = () => {
	const { setFilterOtherOptions } = useTeachingFilterStore();
	const {
		setIsLoadingSectionTeachings,
		setSectionTeachings,
		setIsLoadMoreSectionTeachings,
		setSectionTeachingsPagination
	} = useTeachingStore();
	const { name } = useLocalSearchParams<{ name?: string | string[] }>();
	const sectionName = Array.isArray(name) ? name[0] : name;

	useEffect(() => {
		const dropdownEntities: {
			stateName: string;
			entity: string;
			attributes: string[];
			sort_by: [string, "asc" | "desc"][];
		}[] = [
			{
				stateName: "events",
				entity: "teaching_events",
				attributes: ["id", "name"],
				sort_by: [["name", "asc"]]
			},
			{
				stateName: "teachers",
				entity: "teachers",
				attributes: ["id", "name"],
				sort_by: [["name", "asc"]]
			},
			{
				stateName: "years",
				entity: "years",
				attributes: ["id", "year"],
				sort_by: [["year", "desc"]]
			}
		];

		dropdownEntities.forEach(({ stateName, ...payload }) =>
			getDropdowns(
				payload,
				{
					onSuccess: (data) => {
						setFilterOtherOptions((prevState: any) => ({
							...prevState,
							[stateName]: data.data
						}));
					},
					onError: (error) => {
						console.log(error);
					}
				}
			)
		);

		return () => {};
	}, [setFilterOtherOptions]);

	const handleFilterTeaching = useCallback(
		(selectedFilter: any) => {
			const { selectedBook } = useTeachingFilterStore.getState();
			setIsLoadMoreSectionTeachings(false);
			setIsLoadingSectionTeachings(true);
			const params: GetTeachingParams = {
				page: 1,
				limit: TEACHINGS_PAGE_SIZE,
				category: sectionName,
				teacher: selectedFilter.teachers,
				year: selectedFilter.years,
				event: selectedFilter.events
			};

			if (selectedBook?.bookName) {
				params.passage = selectedBook.bookName;
				params.chapters = selectedBook.chapters.join(",");
			}

			getTeachings(params, {
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

	return { handleFilterTeaching };
};

export default useFilterOther;
