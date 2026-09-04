import {
	getNotificationDetail,
	getNotifications
} from "@/services/notificationServices";
import { getOneSignalSegments } from "@/services/oneSignalServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { OneSignal } from "react-native-onesignal";

const useNotification = () => {
	const {
		setNotificationList,
		setIsLoadingNotificationList,
		setNotificationSegments,
		setNotificationDetail,
		setIsLoadingNotificationDetail,
		setUserNotificationTags
	} = useNotificationStore();
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
		getOneSignalSegments({
			onSuccess: (data) => {
				setNotificationSegments(data.segments);
			},
			onError: (error) => {
				console.log(error);
			}
		});

		void fetchNotifications();

		OneSignal.User.getTags().then((tags) => {
			setUserNotificationTags(tags as any);
		});
	}, [fetchNotifications, setNotificationSegments, setUserNotificationTags]);

	const handleRefreshNotifications = useCallback(() => {
		void fetchNotifications(true);
	}, [fetchNotifications]);

	const handleNotificationItemPressed = (notificationId: number) => {
		setNotificationDetail(null);
		setIsLoadingNotificationDetail(true);

		router.push(`/notifications/${notificationId}`);

		getNotificationDetail(notificationId, {
			onSuccess: (data) => {
				setNotificationDetail(data);
				setIsLoadingNotificationDetail(false);
			},
			onError: (error) => {
				console.log(error);
				setIsLoadingNotificationDetail(false);
			}
		});
	};

	return {
		handleNotificationItemPressed,
		handleRefreshNotifications,
		isRefreshing
	};
};

export default useNotification;
