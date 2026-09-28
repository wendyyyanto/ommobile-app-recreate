import axios from "axios";

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASEURL?.trim() ?? "";
const hasProtocol =
	rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://");
const baseURL = rawBaseUrl ? (hasProtocol ? rawBaseUrl : `https://${rawBaseUrl}`) : "";

const apiToken = process.env.EXPO_PUBLIC_API_TOKEN?.trim();

export default axios.create({
	baseURL,
	headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined
});
