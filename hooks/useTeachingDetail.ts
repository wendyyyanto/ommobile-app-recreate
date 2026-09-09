import { TabEnum } from "@/constants/enums";
import { getTeachingDetails } from "@/services/teachingServices";
import { useTeachingStore } from "@/stores/teachingStore";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const useTeachingDetail = () => {
	const { teachingId } = useLocalSearchParams<{ teachingId: string }>();
	const { setActiveTab, setIsLoadingTeachingDetails, setTeachingDetails } =
		useTeachingStore();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchTeachingDetail = useCallback(
		async (isRefresh = false) => {
			if (!teachingId) return;

			if (isRefresh) {
				setIsRefreshing(true);
			} else {
				setIsLoadingTeachingDetails(true);
			}

			await getTeachingDetails(teachingId, {
				onSuccess: (data: any) => {
					setTeachingDetails(data.data);
				},
				onError: (error) => {
					console.error(error);
				},
				onFulfilled: () => {
					if (isRefresh) {
						setIsRefreshing(false);
					} else {
						setIsLoadingTeachingDetails(false);
					}
				}
			});
		},
		[teachingId, setIsLoadingTeachingDetails, setTeachingDetails]
	);

	useEffect(() => {
		if (!teachingId) return;

		setActiveTab(TabEnum.AUDIO);
		void fetchTeachingDetail();
	}, [fetchTeachingDetail, setActiveTab, teachingId]);

	const handleRefreshTeachingDetail = useCallback(() => {
		void fetchTeachingDetail(true);
	}, [fetchTeachingDetail]);

	return { handleRefreshTeachingDetail, isRefreshing };
};

export default useTeachingDetail;
