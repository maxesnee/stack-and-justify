import { Words } from "./Words.js";
import { Features } from "./Features.js";
import { WordGenerator } from "./wordgenerator/WordGenerator.js";
import { Layout } from "./Layout.js";
import { generateUID } from "./Helpers.js";

export const Font = function(name, data, info) {
	const fontFaceName = info.fileName;
	const id = generateUID();
	const wordGenerator = WordGenerator(fontFaceName, data);
	let isLoading = true;

	async function init() {
		// Load font
		const fontFace = new FontFace(fontFaceName, data);
		document.fonts.add(fontFace);

		await fontFace.load();

		const words = await Words.get();
		const features = Features.css(id);

		try {
			await wordGenerator.sort(words, features);	
		} catch (error) {
			console.log(error);
		}
		
		isLoading = false;

		// Dispatch event
		const event = new CustomEvent("font-loaded", {detail: {fontId: id}});
		window.dispatchEvent(event);
	}

	async function update() {
		isLoading = true;

		const words = await Words.get();
		const features = Features.css(id);

		await wordGenerator.sort(words, features);

		isLoading = false;

		// Dispatch event
		const event = new CustomEvent("font-loaded", {detail: {fontId: id}});
		window.dispatchEvent(event);
		m.redraw();
	}

	init();

	return {
		name,
		fontFaceName,
		data,
		info,
		id,
		update,
		wordGenerator,
		get isLoading() {
			return isLoading;
		},
	}
}