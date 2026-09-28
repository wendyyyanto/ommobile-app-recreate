import { getOneSignalSegments } from "@/services/oneSignalServices";
import { useNotificationStore } from "@/stores/notificationStore";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";
import { OneSignal } from "react-native-onesignal";

const isExpoGo = Constants.executionEnvironment === "storeClient";

const useNotificationSettings = () => {
	const {
		userNotificationTags,
		setNotificationSegments,
		setUserNotificationTags
	} = useNotificationStore();
	const [isLoadingNotificationSettings, setIsLoadingNotificationSettings] =
		useState(true);
	const [hasNotificationSettingsError, setHasNotificationSettingsError] =
		useState(false);

	const loadNotificationSettings = useCallback(async () => {
		let hasError = false;

		setIsLoadingNotificationSettings(true);
		setHasNotificationSettingsError(false);

		await Promise.all([
			getOneSignalSegments({
				onSuccess: (data) => {
					setNotificationSegments(data.segments);
				},
				onError: (error) => {
					hasError = true;
					console.log(error);
				}
			}),
			(async () => {
				if (isExpoGo) {
					setUserNotificationTags({});
					return;
				}

				try {
					const tags = await OneSignal.User.getTags();
					setUserNotificationTags(tags);
				} catch (error) {
					hasError = true;
					console.log(error);
				}
			})()
		]);

		setHasNotificationSettingsError(hasError);
		setIsLoadingNotificationSettings(false);
	}, [setNotificationSegments, setUserNotificationTags]);

	useEffect(() => {
		void loadNotificationSettings();
	}, [loadNotificationSettings]);

	const handleCheckedChange = (checked: boolean, label: string) => {
		const parseTagName = label.toLowerCase().replace(/ /g, "_");

		if (!isExpoGo) {
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

	return {
		handleCheckedChange,
		hasNotificationSettingsError,
		isLoadingNotificationSettings,
		loadNotificationSettings
	};
};

export default useNotificationSettings;
