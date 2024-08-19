import { Font } from './Font.js';
import { Layout } from './Layout.js';
import { parse, getFontInfo } from './miniotparser/MiniOTParser.js';

export const Fonts = [];

export function handleFontFiles(files) {
	const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

	files = Array.from(files);
	const validFiles = files.filter(file => file.name.match(acceptedExtensions));
	
	const loadedFonts = validFiles.map(handleFontFile);

	Promise.all(loadedFonts).then(fonts => {
		sortFonts(fonts);

		fonts.forEach(font => {
			Fonts.push(font);

			// Dispatch event
			const event = new CustomEvent("font-added", {detail: {font: font}});
			window.dispatchEvent(event);
		});

		sortFonts(Fonts);
	});
}

export function handleFontFile(file) {

	return new Promise((resolve, reject) => {
		// Removes file extension from name
		let fileName = file.name.replace(/\..+$/, "");
		// Replace any non alpha numeric characters with -
		fileName = fileName.replace(/\W+/g, "-");
		// Remove leading digits in the filename
		fileName = fileName.replace(/^[0-9]+/g, '');
	
		const reader = new FileReader();

		reader.onloadend = function(e) {
			const fontInfo = getFontInfo(parse(e.target.result), fileName);

			// Check if a font with the same name does not exists already
			if (Fonts.find(font => font.name === fontInfo.fullName)) {
				reject();
			}

			resolve(Font(fontInfo.fullName, e.target.result, fontInfo));
		}

		reader.readAsArrayBuffer(file);
	});
}

export function sortFonts(list) {
	if (list.length <= 1) return list;

	const sortedFonts = list;

	// Sort regular/italic pairs
	sortedFonts.sort((fontA, fontB) => {
		if (fontA.info.isItalic && !fontB.info.isItalic) {
			return 1
		} else if (!fontA.info.isItalic && fontB.info.isItalic) {
			return -1
		} else {
			return 0;
		}
	});

	// Sort by weight
	sortedFonts.sort((fontA, fontB) => {
		return fontA.info.weightClass - fontB.info.weightClass;
	});

	// Sort by width
	sortedFonts.sort((fontA, fontB) => {
		return fontA.info.widthClass - fontB.info.widthClass;
	});

	// Sort by family name
	sortedFonts.sort((fontA, fontB) => {
		return fontA.info.familyName.localeCompare(fontB.info.familyName);
	});

	return sortedFonts;
}