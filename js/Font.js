import { WordGenerator } from "./WordGenerator.js";
import { Layout } from "./Layout.js";
import { generateUID } from "./Helpers.js";

export const Font = function(name, data) {
	// Digits at the beginning of the file name prevent it from loading 
	const fontFaceName = name.replace(/[0-9]/g, '');
	const wordGenerator = WordGenerator(fontFaceName, data);
	let isLoading = true;
	const id = generateUID();

	async function init() {
		const fontFace = new FontFace(fontFaceName, data);
		document.fonts.add(fontFace);

		await fontFace.load();

		try {
			await wordGenerator.sort();	
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
		await wordGenerator.sort();
		isLoading = false;
		m.redraw();
	}

	init();

	return {
		name,
		fontFaceName,
		data,
		id,
		update,
		get isLoading() {
			return isLoading;
		},
		wordGenerator
	}
}