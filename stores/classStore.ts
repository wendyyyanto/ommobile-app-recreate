import { ClassDetails } from "@/types/class";
import { create } from "zustand";

interface ClassState {
	classDetails: ClassDetails | null;
	setClassDetails: (classDetails: ClassDetails | null) => void;
}

export const useClassStore = create<ClassState>()((set) => ({
	classDetails: null,
	setClassDetails: (classDetails: ClassDetails | null) => set({ classDetails })
}));
