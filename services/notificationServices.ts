import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";

// ponytail: single page of 50 (same as ebooks); paginate if notifications ever exceed 50.
export const getNotifications = async (
	q: string,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get("/notifications", {
			params: { page: 1, limit: 50, q: q.trim() || undefined }
		});
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

export const getNotificationDetail = async (
	notificationId: string,
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
