import axios from "axios";

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASEURL?.trim() ?? "";
const hasProtocol =
	rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://");
const baseURL = rawBaseUrl ? (hasProtocol ? rawBaseUrl : `https://${rawBaseUrl}`) : "";

export default axios.create({
	baseURL
});
