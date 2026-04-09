import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";

export const getNotifications = async ({
	onSuccess,
	onError,
	onFulfilled = () => {}
}: RequestHandlerParams) => {
	try {
		const response = await axios.get("/notifications");
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

export const getNotificationDetail = async (
	notificationId: number,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get(`/notifications/${notificationId}`);
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
