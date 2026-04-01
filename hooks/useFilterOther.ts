import { getDropdowns } from "@/services/dropdownServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useEffect } from "react";

const useFilterOther = () => {
	const { setFilterOtherOptions } = useTeachingFilterStore();
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

	return {};
};

export default useFilterOther;
