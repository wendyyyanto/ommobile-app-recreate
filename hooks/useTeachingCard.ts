import { TabEnum } from "@/constants/enums";
import { getTeachingDetails } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { router } from "expo-router";

const useTeachingCard = () => {
	const { setActiveTab, setIsLoadingTeachingDetails, setTeachingDetails } =
		useTeachingStore();

	const handleTeachingCardPress = (teachingId: string) => {
		router.push(`/teachings/${teachingId}`);

		setActiveTab(TabEnum.AUDIO);

		setIsLoadingTeachingDetails(true);
		getTeachingDetails(teachingId, {
			onSuccess: (data: any) => {
				setTeachingDetails(data.data);
				setIsLoadingTeachingDetails(false);
			},
			onError: (error) => {
				console.error(error);
				setIsLoadingTeachingDetails(false);
			}
		});
	};

	return { handleTeachingCardPress };
};

export default useTeachingCard;
