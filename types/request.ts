type RequestHandlerParams = {
	onSuccess: (data: any) => void;
	onError: (error: any) => void;
	onFulfilled?: () => void;
};

type GetDropdownsPayload = {
	entity: string;
	attributes: string[];
	filters?: DropdownFilter[];
	sort_by?: [string, "asc" | "desc"][];
	is_paginated?: 0 | 1;
	page?: number;
	limit?: number;
};

type DropdownFilter = {
	key: string;
	operator:
		| "like"
		| "in"
		| "eq"
		| "ne"
		| "gt"
		| "gte"
		| "lt"
		| "lte"
		| "is"
		| "is_not";
	value: unknown;
	logical?: "and" | "or";
};

type Pagination = {
	page: number;
	limit: number;
	total_items: number;
	total_pages: number;
};

export { GetDropdownsPayload, Pagination, RequestHandlerParams };
