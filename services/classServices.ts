import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";

// ponytail: single page of 50 (API max); paginate if classes ever exceed 50.
export const getClasses = async (
	q: string,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get("/classes", {
			params: { page: 1, limit: 50, q: q.trim() || undefined }
		});
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

export const getClassDetails = async (
	classId: string,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get(`/class/${classId}`);
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
