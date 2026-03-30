import { DropdownOptions } from "@/types/dropdown";
import { create } from "zustand";

type SelectedBook = {
	bookName: string;
	chapters: number[];
};

interface TeachingFilterState {
	isFilterByBookOpen: boolean;
	isFilterByOtherOpen: boolean;
	bookOptions: DropdownOptions[];
	selectedBook: SelectedBook[];
	setIsFilterByBookOpen: (isFilterByBookOpen: boolean) => void;
	setIsFilterByOtherOpen: (isFilterByOtherOpen: boolean) => void;
	setBookOptions: (bookOptions: DropdownOptions[]) => void;
	setSelectedBook: (selectedBook: SelectedBook[]) => void;
}

export const useTeachingFilterStore = create<TeachingFilterState>()((set) => ({
	isFilterByBookOpen: false,
	isFilterByOtherOpen: false,
	bookOptions: [],
	selectedBook: [],
	setIsFilterByBookOpen: (isFilterByBookOpen: boolean) =>
		set({ isFilterByBookOpen }),
	setIsFilterByOtherOpen: (isFilterByOtherOpen: boolean) =>
		set({ isFilterByOtherOpen }),
	setBookOptions: (bookOptions: DropdownOptions[]) => set({ bookOptions }),
	setSelectedBook: (selectedBook: SelectedBook[]) => set({ selectedBook })
}));
