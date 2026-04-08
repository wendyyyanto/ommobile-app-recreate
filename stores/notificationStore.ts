import { Notification } from "@/types/notification";
import { create } from "zustand";

interface NotificationState {
	notificationList: Notification[];
	isLoadingNotificationList: boolean;
	notificationSegments: any[];
	userNotificationTags: any;
	setNotificationList: (notificationList: Notification[]) => void;
	setIsLoadingNotificationList: (isLoadingNotificationList: boolean) => void;
	setNotificationSegments: (notificationSegments: any[]) => void;
	setUserNotificationTags: (userNotificationTags: any[]) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
	notificationList: [],
	isLoadingNotificationList: false,
	notificationSegments: [],
	userNotificationTags: null,
	setNotificationList: (notificationList: Notification[]) =>
		set({ notificationList }),
	setIsLoadingNotificationList: (isLoadingNotificationList: boolean) =>
		set({ isLoadingNotificationList }),
	setNotificationSegments: (notificationSegments: any[]) =>
		set({ notificationSegments }),
	setUserNotificationTags: (userNotificationTags: any[]) =>
		set({ userNotificationTags })
}));
