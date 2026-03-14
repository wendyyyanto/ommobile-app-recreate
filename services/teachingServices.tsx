import axios from "@/config/axios";
import { RequestHandlerParams } from "@/types/request";

type GetTeachingParams = {
	page?: number;
	limit?: number;
	chapters?: string;
	book?: string;
	teacher?: string;
	year?: string;
	category?: string;
	event?: string;
};

export const getTeachings = async (
	params: GetTeachingParams,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get("/teaching", { params });
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
