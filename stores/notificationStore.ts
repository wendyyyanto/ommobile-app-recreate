import {
	Notification,
	NotificationDetail,
	NotificationSegment,
	NotificationTags
} from "@/types/notification";
import { create } from "zustand";

interface NotificationState {
	notificationList: Notification[];
	isLoadingNotificationList: boolean;
	notificationSegments: NotificationSegment[];
	userNotificationTags: NotificationTags | null;
	notificationDetail: NotificationDetail | null;
	isLoadingNotificationDetail: boolean;
	setNotificationList: (notificationList: Notification[]) => void;
	setIsLoadingNotificationList: (isLoadingNotificationList: boolean) => void;
	setNotificationSegments: (
		notificationSegments: NotificationSegment[]
	) => void;
	setUserNotificationTags: (userNotificationTags: NotificationTags) => void;
	setNotificationDetail: (
		notificationDetail: NotificationDetail | null
	) => void;
	setIsLoadingNotificationDetail: (
		isLoadingNotificationDetail: boolean
	) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
	notificationList: [],
	isLoadingNotificationList: false,
	notificationSegments: [],
	userNotificationTags: null,
	notificationDetail: null,
	isLoadingNotificationDetail: false,
	setNotificationList: (notificationList: Notification[]) =>
		set({ notificationList }),
	setIsLoadingNotificationList: (isLoadingNotificationList: boolean) =>
		set({ isLoadingNotificationList }),
	setNotificationSegments: (notificationSegments: NotificationSegment[]) =>
		set({ notificationSegments }),
	setUserNotificationTags: (userNotificationTags: NotificationTags) =>
		set({ userNotificationTags }),
	setNotificationDetail: (notificationDetail: NotificationDetail | null) =>
		set({ notificationDetail }),
	setIsLoadingNotificationDetail: (isLoadingNotificationDetail: boolean) =>
		set({ isLoadingNotificationDetail })
}));
