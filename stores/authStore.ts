import { File, Paths } from "expo-file-system";
import { create } from "zustand";

// ponytail: JWT kept as plain text in the app sandbox; move to expo-secure-store if it needs keychain protection
const sessionFile = new File(Paths.document, "session");
const storedToken = sessionFile.exists ? sessionFile.textSync() : "";

interface Profile {
	name: string;
	email: string;
}

interface AuthState {
	token: string | null;
	isLoggedIn: boolean;
	profile: Profile | null;
	login: (token: string) => void;
	logout: () => void;
	setProfile: (profile: Profile) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
	token: storedToken || null,
	isLoggedIn: !!storedToken,
	profile: null,
	login: (token) => {
		sessionFile.write(token);
		set({ token, isLoggedIn: true });
	},
	logout: () => {
		if (sessionFile.exists) sessionFile.delete();
		set({ token: null, isLoggedIn: false, profile: null });
	},
	setProfile: (profile) => set({ profile })
}));
