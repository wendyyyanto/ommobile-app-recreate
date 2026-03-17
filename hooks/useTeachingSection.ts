import { getTeachings } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
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
		sectionTeachings,
		isLoadingSectionTeachings,
		setIsLoadingSectionTeachings
	} = useTeachingStore();

	useEffect(() => {
		setIsLoadingSectionTeachings(true);
		getTeachings(
			{
				page: 1,
				limit: 10,
				category: sectionName
			},
			{
				onSuccess: (data) => {
					setSectionTeachings(data.data);
					setIsLoadingSectionTeachings(false);
				},
				onError: (error) => {
					console.log(error);
					setIsLoadingSectionTeachings(false);
				}
			}
		);
	}, []);

	return {};
};

export default useTeachingSection;
