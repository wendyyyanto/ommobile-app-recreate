type RequestHandlerParams = {
	onSuccess: (data: any) => void;
	onError: (error: any) => void;
	onFulfilled?: () => void;
};

export { RequestHandlerParams };
