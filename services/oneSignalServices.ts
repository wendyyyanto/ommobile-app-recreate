import { RequestHandlerParams } from "@/types/request";
import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.EXPO_PUBLIC_ONESIGNAL_API_KEY;
const ONE_SIGNAL_BASE_URL = process.env.EXPO_PUBLIC_ONESIGNAL_BASE_URL;

const axiosInstance = axios.create({
	baseURL: `${ONE_SIGNAL_BASE_URL}/${ONE_SIGNAL_APP_ID}`,
	headers: {
		Authorization: `Key ${ONE_SIGNAL_API_KEY}`
	}
});

export const getOneSignalSegments = async ({
	onSuccess,
	onError,
	onFulfilled = () => {}
}: RequestHandlerParams) => {
	try {
		const response = await axiosInstance.get("/segments");
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
