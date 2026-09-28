type Notification = {
	id: number;
	title: string;
	teaser: string;
	eventDate: string;
	createdAt: string;
};

type NotificationDetail = {
	title: string;
	fullMessage: string;
	imageUrl: string;
	eventDate: string;
	createdAt: string;
};

type NotificationSegment = {
	name: string;
};

type NotificationTags = Record<string, string>;

export type {
	Notification,
	NotificationDetail,
	NotificationSegment,
	NotificationTags
};
