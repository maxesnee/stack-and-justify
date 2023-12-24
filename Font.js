import { WordGenerator } from "./WordGenerator.js";
import { Layout } from "./Layout.js";
import { generateUID } from "./Helpers.js";

export const Font = function(name, data) {
	const wordGenerator = WordGenerator(name);
	let isLoading = true;
	const id = generateUID();

	function init() {
		const fontFaceRule = `@font-face { font-family: ${name}; src: url('${data}') }`;
		document.styleSheets[0].insertRule(fontFaceRule, 0);

		wordGenerator.sort().then(() => {
			isLoading = false;
			m.redraw();
		});
	}

	init();

	return {
		name,
		data,
		id,
		get isLoading() {
			return isLoading;
		},
		wordGenerator
	}
}