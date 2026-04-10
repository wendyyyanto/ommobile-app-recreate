import { Dirs, FileSystem } from "react-native-file-access";

export const handleDownloadFile = async (url: string) => {
	try {
		await FileSystem.fetch(url, {
			path:
				Dirs.DocumentDir +
				"/omteaching-resources/" +
				url.split("/").pop()
		});
	} catch (error) {
		console.error(error);
	}
};
