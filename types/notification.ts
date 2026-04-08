type Notification = {
	id: number;
	title: string;
	teaser: string;
	eventDate: string;
};

type NotificationDetail = {
	title: string;
	fullMessage: string;
	imageUrl: string;
	eventDate: string;
};

export type { Notification, NotificationDetail };
