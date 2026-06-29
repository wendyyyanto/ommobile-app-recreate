import {
	getNotificationDetail,
	getNotifications
} from "@/services/notificationServices";
import { getOneSignalSegments } from "@/services/oneSignalServices";
import { useNotificationStore } from "@/stores/notificationStore";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useEffect } from "react";

const isExpoGo = Constants.executionEnvironment === "storeClient";

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

		if (!isExpoGo) {
			const { OneSignal } = require("react-native-onesignal");
			OneSignal.User.getTags().then((tags: any) => {
				setUserNotificationTags(tags);
			});
		}
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
