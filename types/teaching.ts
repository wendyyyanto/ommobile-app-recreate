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
	audioUrl: string;
	videoUrl?: string;
	pdfUrl?: string;
	pptUrl?: string;
};

export type { Teaching, TeachingDetails };
