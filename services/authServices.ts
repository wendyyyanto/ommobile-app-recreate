import axios from "@/constants/axios";
import { RequestHandlerParams } from "@/types/request";

// The API serves website and mobile accounts on the same routes; this header picks mobile.
const headers = { Platform: "Mobile" };

export const register = async (
	body: { name: string; email: string },
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.post("/auth/register", body, { headers });
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

// Success means a sign-in link was emailed; the token arrives later via deep link.
export const login = async (
	body: { email: string },
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.post("/auth/login", body, { headers });
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

// Deletes the signed-in user's account; the API reads the user from the token that the
// axios interceptor adds.
export const deleteAccount = async ({
	onSuccess,
	onError,
	onFulfilled = () => {}
}: RequestHandlerParams) => {
	try {
		const response = await axios.delete("/account-deletion");
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};

export const getProfile = async (
	token: string,
	{ onSuccess, onError, onFulfilled = () => {} }: RequestHandlerParams
) => {
	try {
		const response = await axios.get("/profile", {
			headers: { ...headers, Authorization: `Bearer ${token}` }
		});
		onSuccess(response.data);
	} catch (error) {
		onError(error);
	} finally {
		onFulfilled();
	}
};
