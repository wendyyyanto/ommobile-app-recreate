import { getTeachings } from "@/services/teachingServices";
import { useTeachingFilterStore } from "@/stores/teachingFilterStore";
import { useTeachingStore } from "@/stores/teachingStore";
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
	const { setSectionTeachings, setIsLoadingSectionTeachings } =
		useTeachingStore();
	const { setIsFilterByBookOpen, setIsFilterByOtherOpen } =
		useTeachingFilterStore();

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

	const handleCloseSectionTeachings = () => {
		setIsFilterByBookOpen(false);
		setIsFilterByOtherOpen(false);
		router.back();
	};

	return { handleCloseSectionTeachings };
};

export default useTeachingSection;
