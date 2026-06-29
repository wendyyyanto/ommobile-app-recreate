import { useNotificationStore } from "@/stores/notificationStore";
import Constants from "expo-constants";

const isExpoGo = Constants.executionEnvironment === "storeClient";

const useNotificationSettings = () => {
	const { userNotificationTags, setUserNotificationTags } =
		useNotificationStore();

	const handleCheckedChange = (checked: boolean, label: string) => {
		const parseTagName = label.toLowerCase().replace(/ /g, "_");

		if (!isExpoGo) {
			const { OneSignal } = require("react-native-onesignal");
			if (checked) {
				OneSignal.User.addTag(parseTagName, "active");
			} else {
				OneSignal.User.removeTag(parseTagName);
			}
		}

		setUserNotificationTags({
			...userNotificationTags,
			[parseTagName]: checked ? "active" : "inactive"
		});
	};

	return { handleCheckedChange };
};

export default useNotificationSettings;
