import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASEURL?.trim() ?? "";
const hasProtocol =
	rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://");
const baseURL = rawBaseUrl ? (hasProtocol ? rawBaseUrl : `https://${rawBaseUrl}`) : "";

const apiToken = process.env.EXPO_PUBLIC_API_TOKEN?.trim();

// The API only accepts the magic-link JWT on `@AllowMobile` routes when `Platform: Mobile`
// is sent; without it the token is checked as a website session and fails with 401.
const instance = axios.create({
	baseURL,
	headers: {
		Platform: "Mobile",
		...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {})
	}
});

// Session-gated routes (e.g. /dropdown) reject the static API token with 401, so send
// the magic-link JWT whenever the user is signed in.
instance.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export default instance;
