type EbookTag = {
	id: number;
	label: string;
};

type EbookFile = {
	id: string;
	file_name: string;
	content_type: string;
	size_bytes: number;
	url: string;
};

type EbookSummary = {
	id: number;
	title: string;
	author: string;
	cover_url: string | null;
	tags: EbookTag[];
	uploaded_by: {
		id: string;
		name: string;
	};
	created_at: string;
	updated_at: string;
};

type EbookDetails = Omit<EbookSummary, "cover_url"> & {
	language: string;
	total_pages: number;
	overview: string;
	cover_file: EbookFile | null;
	ebook_file: EbookFile;
};

export type { EbookDetails, EbookSummary };
