import { getOneSignalSegments } from "@/services/oneSignalServices";
import { useNotificationStore } from "@/stores/notificationStore";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";
import { OneSignal } from "react-native-onesignal";

const isExpoGo = Constants.executionEnvironment === "storeClient";

export const toNotificationTagName = (label: string) =>
	label.toLowerCase().replace(/ /g, "_");

// Categories default to on: tag every segment the user hasn't chosen yet.
// Opting out is stored as "inactive", so a missing tag always means "never chosen".
export const enableUnsetNotificationCategories = () =>
	getOneSignalSegments({
		onSuccess: async ({ segments }: { segments: { name: string }[] }) => {
			const tags = await OneSignal.User.getTags();
			const unset = segments
				.map(({ name }) => toNotificationTagName(name))
				.filter((tag) => !(tag in tags));
			if (unset.length) {
				OneSignal.User.addTags(
					Object.fromEntries(unset.map((tag) => [tag, "active"]))
				);
			}
		},
		onError: (error) => console.log(error)
	});

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
		const parseTagName = toNotificationTagName(label);

		if (!isExpoGo) {
			OneSignal.User.addTag(parseTagName, checked ? "active" : "inactive");
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
