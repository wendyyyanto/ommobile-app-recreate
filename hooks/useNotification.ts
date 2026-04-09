import {
	getNotificationDetail,
	getNotifications
} from "@/services/notificationServices";
import { getOneSignalSegments } from "@/services/oneSignalServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { router } from "expo-router";
import { useEffect } from "react";
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

	useEffect(() => {
		setIsLoadingNotificationList(true);

		getOneSignalSegments({
			onSuccess: (data) => {
				setNotificationSegments(data.segments);
			},
			onError: (error) => {
				console.log(error);
			}
		});

		getNotifications({
			onSuccess: (data) => {
				setNotificationList(data);
				setIsLoadingNotificationList(false);
			},
			onError: (error) => {
				console.log(error);
				setIsLoadingNotificationList(false);
			}
		});

		OneSignal.User.getTags().then((tags) => {
			setUserNotificationTags(tags as any);
		});
	}, []);

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

	return { handleNotificationItemPressed };
};

export default useNotification;
