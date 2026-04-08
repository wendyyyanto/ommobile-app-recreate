import { useNotificationStore } from "@/stores/notificationStore";
import { OneSignal } from "react-native-onesignal";

const useNotificationSettings = () => {
	const { userNotificationTags, setUserNotificationTags } =
		useNotificationStore();

	const handleCheckedChange = (checked: boolean, label: string) => {
		const parseTagName = label.toLowerCase().replace(/ /g, "_");

		if (checked) {
			OneSignal.User.addTag(parseTagName, "active");
			setUserNotificationTags({
				...userNotificationTags,
				[parseTagName]: "active"
			});
		} else {
			OneSignal.User.removeTag(parseTagName);
			setUserNotificationTags({
				...userNotificationTags,
				[parseTagName]: "inactive"
			});
		}
	};

	return { handleCheckedChange };
};

export default useNotificationSettings;
