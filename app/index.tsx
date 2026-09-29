import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";

export default function Index() {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

	return <Redirect href={isLoggedIn ? "/(tabs)" : "/login"} />;
}
