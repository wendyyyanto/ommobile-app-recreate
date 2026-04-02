import { getDropdowns } from "@/services/dropdownServices";
import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
import { useCallback, useEffect } from "react";

const useFilterOther = () => {
	const { setFilterOtherOptions } = useTeachingFilterStore();
	const { setIsLoadingSectionTeachings, setSectionTeachings } =
		useTeachingStore();

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
			setIsLoadingSectionTeachings(true);

			getTeachings(
				{
					page: 1,
					limit: 10,
					teacher: selectedFilter.teachers?.join(","),
					year: selectedFilter.years?.join(","),
					event: selectedFilter.events?.join(",")
				},
				{
					onSuccess: (data) => {
						setIsLoadingSectionTeachings(false);
						setSectionTeachings(data.data);
					},
					onError: (error) => {
						console.log(error);
						setIsLoadingSectionTeachings(false);
					}
				}
			);
		},
		[setIsLoadingSectionTeachings, setSectionTeachings]
	);

	return { handleFilterTeaching };
};

export default useFilterOther;
