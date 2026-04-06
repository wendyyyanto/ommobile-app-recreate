type Teaching = {
	id: string;
	title: string;
	category: string;
	teacher: string;
	book: string;
	chapters: string;
	verses: string;
	date: string;
	thumbnailUrl: string;
};

type TeachingDetails = Teaching & {
	youtubeId?: string;
	audioUrl: string;
	videoUrl?: string;
	pdfUrl?: string;
	pptUrl?: string;
};

type GetTeachingParams = {
	page?: number;
	limit?: number;
	chapters?: string;
	book?: string;
	teacher?: string;
	year?: string;
	category?: string;
	event?: string;
};

export type { GetTeachingParams, Teaching, TeachingDetails };
