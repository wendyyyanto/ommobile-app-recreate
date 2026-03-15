import { Announcement } from "@/types/announcement";
import { create } from "zustand";

interface AnnouncementState {
	announcementList: Announcement[];
	setAnnouncementList: (announcementList: Announcement[]) => void;
}

export const useAnnouncementStore = create<AnnouncementState>()((set) => ({
	announcementList: [],
	setAnnouncementList: (announcementList: Announcement[]) =>
		set({ announcementList })
}));
