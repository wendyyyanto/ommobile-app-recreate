type ClassCategory = {
	id: number;
	label: string;
};

type ClassUploader = {
	id: string;
	name: string;
};

type ClassSummary = {
	id: number;
	title: string;
	total_weeks: number;
	class_category: ClassCategory;
	uploaded_by: ClassUploader;
	created_at: string;
	updated_at: string;
};

type ClassMaterial = {
	id: number;
	week: number;
	title: string;
	file: {
		id: string;
		file_name: string;
		content_type: string;
		size_bytes: number;
		url: string;
	} | null;
	created_at: string;
	updated_at: string;
};

type ClassDetails = ClassSummary & {
	description: string;
	materials: ClassMaterial[];
};

export type { ClassDetails, ClassMaterial, ClassSummary };
