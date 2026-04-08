import { getNotifications } from "@/services/notificationServices";
import { getOneSignalSegments } from "@/services/oneSignalServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { useEffect } from "react";

const useNotification = () => {
	const {
		setNotificationList,
		setIsLoadingNotificationList,
		setNotificationSegments
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
	}, []);

	return {};
};

export default useNotification;
