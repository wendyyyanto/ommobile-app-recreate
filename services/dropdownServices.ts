import axios from "@/constants/axios";
import { GetDropdownsPayload, RequestHandlerParams } from "@/types/request";

export const getDropdowns = async (
	payload: GetDropdownsPayload,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.post("/dropdown", payload);
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
