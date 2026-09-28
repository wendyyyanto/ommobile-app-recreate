import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";
import { GetTeachingParams } from "@/types/teaching";

// The app's section names differ from the API's category enum in one place.
const CATEGORY_ALIASES: Record<string, string> = {
	Topical: "Topical Teaching"
};

// Repeat array keys (teacher=a&teacher=b), which the API parses as arrays.
const paramsSerializer = { indexes: null };

export const getTeachings = async (
	{ category, ...params }: GetTeachingParams,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get("/teachings", {
			params: {
				...params,
				category: category
					? (CATEGORY_ALIASES[category] ?? category)
					: undefined
			},
			paramsSerializer
		});
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
		const response = await axios.get(`/teachings/${teachingId}`);
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
