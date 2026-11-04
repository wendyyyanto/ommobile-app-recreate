import { getNotifications } from "@/services/notificationServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { router } from "expo-router";
import { showErrorToast } from "@/utils/toastHelper";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const useNotification = () => {
	const { setNotificationList, setIsLoadingNotificationList } =
		useNotificationStore(
			useShallow((s) => ({
				setNotificationList: s.setNotificationList,
				setIsLoadingNotificationList: s.setIsLoadingNotificationList
			}))
		);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [hasError, setHasError] = useState(false);

	const fetchNotifications = useCallback(
		async (isRefresh = false) => {
			setHasError(false);
			if (isRefresh) {
				setIsRefreshing(true);
			} else {
				setIsLoadingNotificationList(true);
			}

			await getNotifications("", {
				onSuccess: (data) => {
					setNotificationList(data.data);
				},
				onError: (error) => {
					console.log(error);
					setHasError(true);
					if (useNotificationStore.getState().notificationList.length > 0) {
						showErrorToast("Couldn't refresh. Please try again.");
					}
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

	const handleNotificationItemPressed = (notificationId: string) => {
		router.push(`/notifications/${notificationId}`);
	};

	return {
		hasError,
		handleNotificationItemPressed,
		handleRefreshNotifications,
		isRefreshing
	};
};

export default useNotification;
