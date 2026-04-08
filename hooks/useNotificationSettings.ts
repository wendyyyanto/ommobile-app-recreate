import { useNotificationStore } from "@/stores/notificationStore";
import { useEffect } from "react";
import { OneSignal } from "react-native-onesignal";

const useNotificationSettings = () => {
	const { setUserNotificationTags } = useNotificationStore();

	useEffect(() => {
		OneSignal.User.getTags().then((tags) => {
			setUserNotificationTags(tags as any);
		});

		return () => {};
	}, []);

	const handleCheckedChange = (checked: boolean, label: string) => {
		const parseTagName = label.toLowerCase().replace(/ /g, "_");

		if (checked) {
			OneSignal.User.addTag(parseTagName, "active");
		} else {
			OneSignal.User.removeTag(parseTagName);
		}
	};

	return { handleCheckedChange };
};

export default useNotificationSettings;
