import { getNotificationDetail } from "@/services/notificationServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const useNotificationDetail = () => {
	const { notificationId } = useLocalSearchParams<{
		notificationId: string;
	}>();
	const { setNotificationDetail, setIsLoadingNotificationDetail } =
		useNotificationStore();

	useEffect(() => {
		if (!notificationId) return;

		setNotificationDetail(null);
		setIsLoadingNotificationDetail(true);

		getNotificationDetail(Number(notificationId), {
			onSuccess: (data) => {
				setNotificationDetail(data);
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
