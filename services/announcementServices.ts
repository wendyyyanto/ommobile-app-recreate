import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";

export const getAnnouncements = async ({
	onSuccess,
	onError,
	onFulfilled = () => {}
}: RequestHandlerParams) => {
	try {
		const response = await axios.get("/announcements");
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
