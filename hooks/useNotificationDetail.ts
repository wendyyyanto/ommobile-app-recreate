import { getNotificationDetail } from "@/services/notificationServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const useNotificationDetail = () => {
	const { notificationId } = useLocalSearchParams<{
		notificationId: string;
	}>();
	const {
		setNotificationDetail,
		setIsLoadingNotificationDetail
	} = useNotificationStore(
		useShallow((s) => ({
			setNotificationDetail: s.setNotificationDetail,
			setIsLoadingNotificationDetail: s.setIsLoadingNotificationDetail
		}))
	);

	useEffect(() => {
		if (!notificationId) return;

		setNotificationDetail(null);
		setIsLoadingNotificationDetail(true);

		getNotificationDetail(notificationId, {
			onSuccess: (data) => {
				setNotificationDetail(data.data);
				setIsLoadingNotificationDetail(false);
			},
			onError: (error) => {
				console.log(error);
				setIsLoadingNotificationDetail(false);
			}
		});
	}, [notificationId]);
};

export default useNotificationDetail;
