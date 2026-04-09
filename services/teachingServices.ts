import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";
import { GetTeachingParams } from "@/types/teaching";

type GetSearchTeachingsParams = {
	page?: number;
	limit?: number;
	q: string;
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

export const getTeachingDetails = async (
	teachingId: string,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get(`/teaching/${teachingId}`);
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

export const getSearchTeachings = async (
	params: GetSearchTeachingsParams,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get("/teaching/search", { params });
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
