type Notification = {
	id: string;
	title: string;
	description: string;
	event_date: string;
	segment: { id: number; name: string };
	thumbnail: { id: string; url: string } | null;
	onesignal_id: string | null;
	created_at: string;
	updated_at: string;
};

type NotificationSegment = {
	name: string;
};

type NotificationTags = Record<string, string>;

export type { Notification, NotificationSegment, NotificationTags };
