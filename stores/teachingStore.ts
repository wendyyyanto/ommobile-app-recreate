import { Teaching } from "@/types/teaching";
import { create } from "zustand";

interface TeachingState {
	latestTeachings: Teaching[];
	popularTeachings: Teaching[];
	sectionTeachings: Teaching[];
	searchTeachings: Teaching[];
	isLoadingLatestTeachings: boolean;
	isLoadingPopularTeachings: boolean;
	isLoadingSectionTeachings: boolean;
	isLoadingSearchTeachings: boolean;
	searchQuery: string;
	setLatestTeachings: (latestTeachings: Teaching[]) => void;
	setPopularTeachings: (popularTeachings: Teaching[]) => void;
	setSectionTeachings: (sectionTeachings: Teaching[]) => void;
	setSearchTeachings: (searchTeachings: Teaching[]) => void;
	setIsLoadingLatestTeachings: (isLoadingLatestTeachings: boolean) => void;
	setIsLoadingPopularTeachings: (isLoadingPopularTeachings: boolean) => void;
	setIsLoadingSectionTeachings: (isLoadingSectionTeachings: boolean) => void;
	setIsLoadingSearchTeachings: (isLoadingSearchTeachings: boolean) => void;
	setSearchQuery: (searchQuery: string) => void;
}

export const useTeachingStore = create<TeachingState>()((set) => ({
	latestTeachings: [],
	popularTeachings: [],
	sectionTeachings: [],
	searchTeachings: [],
	isLoadingLatestTeachings: false,
	isLoadingPopularTeachings: false,
	isLoadingSectionTeachings: false,
	isLoadingSearchTeachings: false,
	searchQuery: "",
	setLatestTeachings: (latestTeachings: Teaching[]) =>
		set({ latestTeachings }),
	setPopularTeachings: (popularTeachings: Teaching[]) =>
		set({ popularTeachings }),
	setSectionTeachings: (sectionTeachings: Teaching[]) =>
		set({ sectionTeachings }),
	setSearchTeachings: (searchTeachings: Teaching[]) =>
		set({ searchTeachings }),
	setIsLoadingLatestTeachings: (isLoadingLatestTeachings: boolean) =>
		set({ isLoadingLatestTeachings }),
	setIsLoadingPopularTeachings: (isLoadingPopularTeachings: boolean) =>
		set({ isLoadingPopularTeachings }),
	setIsLoadingSectionTeachings: (isLoadingSectionTeachings: boolean) =>
		set({ isLoadingSectionTeachings }),
	setIsLoadingSearchTeachings: (isLoadingSearchTeachings: boolean) =>
		set({ isLoadingSearchTeachings }),
	setSearchQuery: (searchQuery: string) => set({ searchQuery })
}));
