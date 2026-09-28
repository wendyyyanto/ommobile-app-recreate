type TeachingUploader = {
	id: string;
	name: string;
};

type TeachingFile = {
	id: string;
	file_name: string;
	content_type: string;
	size_bytes: number | null;
	url: string | null;
};

type Teaching = {
	id: string;
	title: string;
	passage: string;
	chapters: string;
	category: string;
	teacher: string;
	date: string;
	thumbnail_url: string | null;
	uploaded_by: TeachingUploader;
};

// The detail endpoint doesn't return thumbnail_url yet.
type TeachingDetails = Omit<Teaching, "date" | "thumbnail_url"> & {
	thumbnail_url?: string | null;
	year: string;
	event: string;
	audio_file: TeachingFile | null;
	video_url: string | null;
	pdf_file: TeachingFile | null;
	ppt_file: TeachingFile | null;
	created_at: string;
	updated_at: string;
};

type GetTeachingParams = {
	page?: number;
	limit?: number;
	q?: string;
	passage?: string;
	chapters?: string;
	category?: string;
	teacher?: string[];
	year?: string[];
	event?: string[];
};

export type { GetTeachingParams, Teaching, TeachingDetails, TeachingFile };
