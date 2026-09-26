import { router } from "expo-router";

const useTeachingCard = () => {
	const handleTeachingCardPress = (teachingId: string) => {
		router.push(`/teaching/${teachingId}`);
	};

	return { handleTeachingCardPress };
};

export default useTeachingCard;
