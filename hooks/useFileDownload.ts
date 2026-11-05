import { handleDownloadFile } from "@/utils/fileHelper";
import { useState } from "react";

const useFileDownload = () => {
	const [pendingUrls, setPendingUrls] = useState<string[]>([]);

	const downloadFile = async (url: string) => {
		setPendingUrls((urls) => [...urls, url]);
		await handleDownloadFile(url);
		setPendingUrls((urls) => urls.filter((pending) => pending !== url));
	};

	return { pendingUrls, downloadFile };
};

export default useFileDownload;
