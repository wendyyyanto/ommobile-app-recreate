import { getTeachings } from "@/services/teachingServices";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
	useEffect(() => {
		getTeachings(
			{ page: 1, limit: 10, teacher: "lisa" },
			{
				onSuccess: (data) => {
					console.log(data);
				},
				onError: (error) => {
					console.log(error);
				}
			}
		);
	}, []);

	return <View className="flex-1 justify-center items-center"></View>;
}
