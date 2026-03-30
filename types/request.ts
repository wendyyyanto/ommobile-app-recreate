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

export { GetDropdownsPayload, RequestHandlerParams };
