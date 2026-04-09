import { Directory, File, Paths } from "expo-file-system";

export const handleDownloadFile = async (url: string) => {
	const destination = new Directory(Paths.cache, "omteaching-resources");

	try {
		const output = await File.downloadFileAsync(url, destination);
		console.log(output.info());
		console.log(output.uri);
	} catch (error) {
		console.error(error);
	}
};
