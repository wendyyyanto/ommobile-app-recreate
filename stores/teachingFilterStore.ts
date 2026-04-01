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
	selectedBook: SelectedBook | null;
	bookChapters: DropdownOptions[];
	setIsFilterByBookOpen: (isFilterByBookOpen: boolean) => void;
	setIsFilterByOtherOpen: (isFilterByOtherOpen: boolean) => void;
	setBookOptions: (bookOptions: DropdownOptions[]) => void;
	setSelectedBook: (selectedBook: SelectedBook | null) => void;
	setBookChapters: (bookChapters: DropdownOptions[]) => void;
}

export const useTeachingFilterStore = create<TeachingFilterState>()((set) => ({
	isFilterByBookOpen: false,
	isFilterByOtherOpen: false,
	bookOptions: [],
	selectedBook: null,
	bookChapters: [],
	setIsFilterByBookOpen: (isFilterByBookOpen: boolean) =>
		set({ isFilterByBookOpen }),
	setIsFilterByOtherOpen: (isFilterByOtherOpen: boolean) =>
		set({ isFilterByOtherOpen }),
	setBookOptions: (bookOptions: DropdownOptions[]) => set({ bookOptions }),
	setSelectedBook: (selectedBook: SelectedBook | null) =>
		set({ selectedBook }),
	setBookChapters: (bookChapters: DropdownOptions[]) => set({ bookChapters })
}));
