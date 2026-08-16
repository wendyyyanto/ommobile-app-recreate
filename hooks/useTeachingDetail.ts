import { TabEnum } from "@/constants/enums";
import { getTeachingDetails } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const useTeachingDetail = () => {
	const { teachingId } = useLocalSearchParams<{ teachingId: string }>();
	const { setActiveTab, setIsLoadingTeachingDetails, setTeachingDetails } =
		useTeachingStore();

	useEffect(() => {
		if (!teachingId) return;

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
	}, [teachingId]);
};

export default useTeachingDetail;
