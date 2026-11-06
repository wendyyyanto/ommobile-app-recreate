const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "node_modules", "pdfjs-dist");
const { version } = require(path.join(root, "package.json"));
const target = path.join(__dirname, "dist", "pdf-viewer", version);

const copy = (from, to) =>
	fs.cpSync(path.join(root, from), path.join(target, to), { recursive: true });

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

copy("legacy/build/pdf.min.mjs", "pdf.min.mjs");
copy("legacy/build/pdf.worker.min.mjs", "pdf.worker.min.mjs");
copy("legacy/web/pdf_viewer.mjs", "pdf_viewer.mjs");
copy("legacy/web/pdf_viewer.css", "pdf_viewer.css");
copy("legacy/web/images", "images");
copy("cmaps", "cmaps");
copy("standard_fonts", "standard_fonts");
copy("wasm", "wasm");

for (const file of ["index.html", "viewer.css", "viewer.mjs"]) {
	fs.copyFileSync(path.join(__dirname, file), path.join(target, file));
}

console.log(`copied pdfjs-dist ${version} to ${path.relative(process.cwd(), target)}`);
