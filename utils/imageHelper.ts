const getImageSource = (image: string | number) => {
	return typeof image === "string" ? { uri: image } : image;
};

export { getImageSource };
