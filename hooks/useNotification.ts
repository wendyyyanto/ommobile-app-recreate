import { getNotifications } from "@/services/notificationServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const useNotification = () => {
	const { setNotificationList, setIsLoadingNotificationList } =
		useNotificationStore();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const fetchNotifications = useCallback(
		async (isRefresh = false) => {
			if (isRefresh) {
				setIsRefreshing(true);
			} else {
				setIsLoadingNotificationList(true);
			}

			await getNotifications({
				onSuccess: (data) => {
					setNotificationList(data);
				},
				onError: (error) => {
					console.log(error);
				},
				onFulfilled: () => {
					if (isRefresh) {
						setIsRefreshing(false);
					} else {
						setIsLoadingNotificationList(false);
					}
				}
			});
		},
		[setIsLoadingNotificationList, setNotificationList]
	);

	useEffect(() => {
		void fetchNotifications();
	}, [fetchNotifications]);

	const handleRefreshNotifications = useCallback(() => {
		void fetchNotifications(true);
	}, [fetchNotifications]);

	const handleNotificationItemPressed = (notificationId: number) => {
		router.push(`/notifications/${notificationId}`);
	};

	return {
		handleNotificationItemPressed,
		handleRefreshNotifications,
		isRefreshing
	};
};

export default useNotification;
