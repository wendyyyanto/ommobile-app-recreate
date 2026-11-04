import { File, Paths } from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const TOKEN_KEY = "session";
const secureStoreOptions = {
	keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK
};

const readStoredToken = () => {
	try {
		const legacySessionFile = new File(Paths.document, "session");
		if (legacySessionFile.exists) {
			const token = legacySessionFile.textSync();
			SecureStore.setItem(TOKEN_KEY, token, secureStoreOptions);
			legacySessionFile.delete();
			return token;
		}
		return SecureStore.getItem(TOKEN_KEY, secureStoreOptions) ?? "";
	} catch {
		return "";
	}
};

const storedToken = readStoredToken();

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
		SecureStore.setItem(TOKEN_KEY, token, secureStoreOptions);
		set({ token, isLoggedIn: true });
	},
	logout: () => {
		void SecureStore.deleteItemAsync(TOKEN_KEY, secureStoreOptions);
		set({ token: null, isLoggedIn: false, profile: null });
	},
	setProfile: (profile) => set({ profile })
}));
