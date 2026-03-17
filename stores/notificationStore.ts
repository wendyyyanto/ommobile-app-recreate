import { Notification } from "@/types/notification";
import { create } from "zustand";

interface NotificationState {
	notificationList: Notification[];
	isLoadingNotificationList: boolean;
	setNotificationList: (notificationList: Notification[]) => void;
	setIsLoadingNotificationList: (isLoadingNotificationList: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
	notificationList: [],
	isLoadingNotificationList: false,
	setNotificationList: (notificationList: Notification[]) =>
		set({ notificationList }),
	setIsLoadingNotificationList: (isLoadingNotificationList: boolean) =>
		set({ isLoadingNotificationList })
}));
