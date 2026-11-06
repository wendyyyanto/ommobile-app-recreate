import * as pdfjsLib from "./pdf.min.mjs";

globalThis.pdfjsLib = pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	"./pdf.worker.min.mjs",
	import.meta.url
).href;

const { EventBus, PDFLinkService, PDFFindController, PDFViewer } = await import(
	"./pdf_viewer.mjs"
);

const base = new URL("./", import.meta.url).href;
const FIND_STATES = ["found", "notFound", "wrapped", "pending"];

const post = (message) => {
	const text = JSON.stringify(message);
	if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(text);
	else console.log(text);
};

const container = document.getElementById("viewerContainer");
const eventBus = new EventBus();
const linkService = new PDFLinkService({ eventBus });
const findController = new PDFFindController({ eventBus, linkService });
const viewer = new PDFViewer({
	container,
	eventBus,
	linkService,
	findController
});
linkService.setViewer(viewer);

let currentLoadId = 0;
let incoming = null;
let findStatus = "found";
let lastQuery = "";

const toBytes = (base64) => {
	const text = atob(base64);
	const bytes = new Uint8Array(text.length);
	for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
	return bytes;
};

const joinBytes = (parts) => {
	const bytes = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
	let offset = 0;
	for (const part of parts) {
		bytes.set(part, offset);
		offset += part.length;
	}
	return bytes;
};

const errorCode = (error) =>
	error?.name === "PasswordException"
		? "password"
		: error?.name === "InvalidPDFException"
			? "invalid"
			: "unknown";

const openDocument = async (loadId, data) => {
	try {
		const doc = await pdfjsLib.getDocument({
			data,
			cMapUrl: `${base}cmaps/`,
			cMapPacked: true,
			standardFontDataUrl: `${base}standard_fonts/`,
			wasmUrl: `${base}wasm/`,
			isEvalSupported: false
		}).promise;
		if (loadId !== currentLoadId) {
			doc.destroy();
			return;
		}
		viewer.setDocument(doc);
		linkService.setDocument(doc, null);
		post({ type: "loaded", loadId, pageCount: doc.numPages });
	} catch (error) {
		if (loadId === currentLoadId) post({ type: "error", code: errorCode(error) });
	}
};

const dispatchFind = (type, findPrevious) =>
	eventBus.dispatch("find", {
		source: window,
		type,
		query: lastQuery,
		caseSensitive: false,
		entireWord: false,
		highlightAll: true,
		findPrevious,
		matchDiacritics: false
	});

const fitToWidth = () => {
	if (container.clientWidth > 0 && viewer.pagesCount) {
		viewer.currentScaleValue = "page-width";
	}
};

eventBus.on("pagesinit", fitToWidth);
new ResizeObserver(fitToWidth).observe(container);

eventBus.on("pagechanging", (event) => {
	post({ type: "page", page: event.pageNumber });
});

eventBus.on("updatefindcontrolstate", (event) => {
	findStatus = FIND_STATES[event.state] ?? "found";
	post({
		type: "findState",
		state: findStatus,
		current: event.matchesCount.current,
		total: event.matchesCount.total
	});
});

eventBus.on("updatefindmatchescount", (event) => {
	post({
		type: "findState",
		state: findStatus,
		current: event.matchesCount.current,
		total: event.matchesCount.total
	});
});

const receive = (message) => {
	switch (message.type) {
		case "loadStart":
			currentLoadId = message.loadId;
			incoming = { loadId: message.loadId, parts: new Array(message.chunks), received: 0 };
			break;
		case "loadChunk":
			if (!incoming || incoming.loadId !== message.loadId) return;
			incoming.parts[message.index] = toBytes(message.data);
			incoming.received += 1;
			if (incoming.received === incoming.parts.length) {
				const { loadId, parts } = incoming;
				incoming = null;
				openDocument(loadId, joinBytes(parts));
			}
			break;
		case "goToPage":
			if (viewer.pagesCount) {
				viewer.currentPageNumber = Math.min(
					Math.max(1, message.page),
					viewer.pagesCount
				);
			}
			break;
		case "find":
			lastQuery = message.query;
			dispatchFind("", false);
			break;
		case "findStep":
			if (lastQuery) dispatchFind("again", message.previous);
			break;
		case "findClear":
			lastQuery = "";
			eventBus.dispatch("findbarclose", { source: window });
			break;
	}
};

window.pdfBridge = { receive };
post({ type: "ready" });
