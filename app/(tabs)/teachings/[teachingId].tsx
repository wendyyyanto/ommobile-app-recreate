import { Redirect, useLocalSearchParams } from "expo-router";

// Keeps old /teachings/:id deep links working; the detail screen lives at the
// root stack so back returns to whichever tab opened it.
export default function TeachingDetailRedirect() {
	const { teachingId } = useLocalSearchParams<{ teachingId: string }>();
	return <Redirect href={`/teaching/${teachingId}`} />;
}
