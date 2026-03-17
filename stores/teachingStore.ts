import { Teaching } from "@/types/teaching";
import { create } from "zustand";

interface TeachingState {
	latestTeachings: Teaching[];
	popularTeachings: Teaching[];
	sectionTeachings: Teaching[];
	isLoadingLatestTeachings: boolean;
	isLoadingPopularTeachings: boolean;
	isLoadingSectionTeachings: boolean;
	setLatestTeachings: (latestTeachings: Teaching[]) => void;
	setPopularTeachings: (popularTeachings: Teaching[]) => void;
	setSectionTeachings: (sectionTeachings: Teaching[]) => void;
	setIsLoadingLatestTeachings: (isLoadingLatestTeachings: boolean) => void;
	setIsLoadingPopularTeachings: (isLoadingPopularTeachings: boolean) => void;
	setIsLoadingSectionTeachings: (isLoadingSectionTeachings: boolean) => void;
}

export const useTeachingStore = create<TeachingState>()((set) => ({
	latestTeachings: [],
	popularTeachings: [],
	sectionTeachings: [],
	isLoadingLatestTeachings: false,
	isLoadingPopularTeachings: false,
	isLoadingSectionTeachings: false,
	setLatestTeachings: (latestTeachings: Teaching[]) =>
		set({ latestTeachings }),
	setPopularTeachings: (popularTeachings: Teaching[]) =>
		set({ popularTeachings }),
	setSectionTeachings: (sectionTeachings: Teaching[]) =>
		set({ sectionTeachings }),
	setIsLoadingLatestTeachings: (isLoadingLatestTeachings: boolean) =>
		set({ isLoadingLatestTeachings }),
	setIsLoadingPopularTeachings: (isLoadingPopularTeachings: boolean) =>
		set({ isLoadingPopularTeachings }),
	setIsLoadingSectionTeachings: (isLoadingSectionTeachings: boolean) =>
		set({ isLoadingSectionTeachings })
}));
