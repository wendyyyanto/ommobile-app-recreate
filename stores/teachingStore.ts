import { TabEnum } from "@/constants/enums";
import { TEACHINGS_PAGE_SIZE } from "@/constants/pagination";
import { Pagination } from "@/types/request";
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
	isLoadMoreLatestTeachings: boolean;
	isLoadMoreSectionTeachings: boolean;
	isLoadMoreSearchTeachings: boolean;
	latestTeachingsPagination: Pagination;
	sectionTeachingsPagination: Pagination;
	searchTeachingsPagination: Pagination;
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
	setIsLoadMoreLatestTeachings: (isLoadMoreLatestTeachings: boolean) => void;
	setIsLoadMoreSectionTeachings: (
		isLoadMoreSectionTeachings: boolean
	) => void;
	setIsLoadMoreSearchTeachings: (isLoadMoreSearchTeachings: boolean) => void;
	setLatestTeachingsPagination: (
		latestTeachingsPagination: Pagination
	) => void;
	setSectionTeachingsPagination: (
		sectionTeachingsPagination: Pagination
	) => void;
	setSearchTeachingsPagination: (
		searchTeachingsPagination: Pagination
	) => void;
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
	isLoadMoreLatestTeachings: false,
	isLoadMoreSectionTeachings: false,
	isLoadMoreSearchTeachings: false,
	latestTeachingsPagination: {
		page: 1,
		limit: TEACHINGS_PAGE_SIZE,
		totalPages: 1
	},
	sectionTeachingsPagination: {
		page: 1,
		limit: TEACHINGS_PAGE_SIZE,
		totalPages: 1
	},
	searchTeachingsPagination: {
		page: 1,
		limit: TEACHINGS_PAGE_SIZE,
		totalPages: 1
	},
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
		set({ isLoadingTeachingDetails }),
	setIsLoadMoreLatestTeachings: (isLoadMoreLatestTeachings: boolean) =>
		set({ isLoadMoreLatestTeachings }),
	setIsLoadMoreSectionTeachings: (isLoadMoreSectionTeachings: boolean) =>
		set({ isLoadMoreSectionTeachings }),
	setIsLoadMoreSearchTeachings: (isLoadMoreSearchTeachings: boolean) =>
		set({ isLoadMoreSearchTeachings }),
	setLatestTeachingsPagination: (latestTeachingsPagination: Pagination) =>
		set({ latestTeachingsPagination }),
	setSectionTeachingsPagination: (sectionTeachingsPagination: Pagination) =>
		set({ sectionTeachingsPagination }),
	setSearchTeachingsPagination: (searchTeachingsPagination: Pagination) =>
		set({ searchTeachingsPagination })
}));
