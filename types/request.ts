type RequestHandlerParams = {
	onSuccess: (data: any) => void;
	onError: (error: any) => void;
	onFulfilled?: () => void;
};

type GetDropdownsPayload = {
	entity: string;
	attributes: string[];
	filters?: DropdownFilters;
};

type DropdownFilters = {
	include?: any;
	exclude?: any;
};

type Pagination = {
	page: number;
	limit: number;
	totalPages: number;
};

export { GetDropdownsPayload, Pagination, RequestHandlerParams };
