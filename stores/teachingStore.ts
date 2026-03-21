import { TabEnum } from "@/constants/enums";
import { Teaching, TeachingDetails } from "@/types/teaching";
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
	activeTab: TabEnum;
	teachingDetails: TeachingDetails | null;
	isLoadingTeachingDetails: boolean;
	setLatestTeachings: (latestTeachings: Teaching[]) => void;
	setPopularTeachings: (popularTeachings: Teaching[]) => void;
	setSectionTeachings: (sectionTeachings: Teaching[]) => void;
	setSearchTeachings: (searchTeachings: Teaching[]) => void;
	setIsLoadingLatestTeachings: (isLoadingLatestTeachings: boolean) => void;
	setIsLoadingPopularTeachings: (isLoadingPopularTeachings: boolean) => void;
	setIsLoadingSectionTeachings: (isLoadingSectionTeachings: boolean) => void;
	setIsLoadingSearchTeachings: (isLoadingSearchTeachings: boolean) => void;
	setSearchQuery: (searchQuery: string) => void;
	setActiveTab: (activeTab: TabEnum) => void;
	setTeachingDetails: (teachingDetails: TeachingDetails) => void;
	setIsLoadingTeachingDetails: (isLoadingTeachingDetails: boolean) => void;
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
	activeTab: TabEnum.AUDIO,
	teachingDetails: null,
	isLoadingTeachingDetails: false,
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
	setSearchQuery: (searchQuery: string) => set({ searchQuery }),
	setActiveTab: (activeTab: TabEnum) => set({ activeTab }),
	setTeachingDetails: (teachingDetails: TeachingDetails) =>
		set({ teachingDetails }),
	setIsLoadingTeachingDetails: (isLoadingTeachingDetails: boolean) =>
		set({ isLoadingTeachingDetails })
}));
