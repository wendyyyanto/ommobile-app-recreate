import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";

// ponytail: single page of 50 (API max); paginate if ebooks ever exceed 50.
export const getEbooks = async (
	q: string,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get("/ebooks", {
			params: { page: 1, limit: 50, q: q.trim() || undefined }
		});
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

export const getEbookDetails = async (
	ebookId: string,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get(`/ebook/${ebookId}`);
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
