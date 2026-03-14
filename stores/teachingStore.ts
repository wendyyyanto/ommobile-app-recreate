import { Teaching } from "@/types/teaching";
import { create } from "zustand";

interface TeachingState {
	teachingList: Teaching[];
	isLoadingTeachingList: boolean;
	setTeachingList: (teachingList: Teaching[]) => void;
	setIsLoadingTeachingList: (isLoadingTeachingList: boolean) => void;
}

export const useTeachingStore = create<TeachingState>()((set) => ({
	teachingList: [],
	isLoadingTeachingList: false,
	setTeachingList: (teachingList: Teaching[]) => set({ teachingList }),
	setIsLoadingTeachingList: (isLoadingTeachingList: boolean) =>
		set({ isLoadingTeachingList })
}));
