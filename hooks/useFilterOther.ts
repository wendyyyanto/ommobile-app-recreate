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
		const dropdownEntities = [
			{
				stateName: "events",
				entity: "teaching_events",
				attributes: ["id", "name"]
			},
			{
				stateName: "teachers",
				entity: "teachers",
				attributes: ["id", "name"]
			},
			{ stateName: "years", entity: "years", attributes: ["id", "year"] }
		];

		dropdownEntities.map((entity) =>
			getDropdowns(
				{ entity: entity.entity, attributes: entity.attributes },
				{
					onSuccess: (data) => {
						setFilterOtherOptions((prevState: any) => ({
							...prevState,
							[entity.stateName]: data.data
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
				teacher: selectedFilter.teachers?.join(","),
				year: selectedFilter.years?.join(","),
				event: selectedFilter.events?.join(",")
			};

			if (selectedBook?.bookName) {
				params.book = selectedBook.bookName;
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
