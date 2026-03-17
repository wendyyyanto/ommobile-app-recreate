import { getNotifications } from "@/services/notificationServices";
import { useNotificationStore } from "@/stores/notificationStore";
import { useEffect } from "react";

const useNotification = () => {
	const { setNotificationList, setIsLoadingNotificationList } =
		useNotificationStore();

	useEffect(() => {
		setIsLoadingNotificationList(true);
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
