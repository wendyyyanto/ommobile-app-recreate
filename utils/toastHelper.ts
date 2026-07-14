import Toast from "react-native-toast-message";

export const showErrorToast = (text1: string, text2?: string): void => {
	Toast.show({ type: "error", text1, text2, visibilityTime: 6000 });
};

export const showSuccessToast = (text1: string, text2?: string): void => {
	Toast.show({ type: "success", text1, text2, visibilityTime: 6000 });
};

export const showInfoToast = (text1: string, text2?: string): void => {
	Toast.show({ type: "info", text1, text2, visibilityTime: 6000 });
};
