import { WordGenerator } from "./WordGenerator.js";
import { Layout } from "./Layout.js";

export const Font = function(name, data) {
	const wordGenerator = WordGenerator(name);
	let isLoading = true;

	function init() {
		const fontFaceRule = `@font-face { font-family: ${name}; src: url('${data}') }`;
		document.styleSheets[0].insertRule(fontFaceRule, 0);

		wordGenerator.sort().then(() => {
			isLoading = false;
			m.redraw();
		});
	}

	function remove() {
		Layout.update();

		return null;
	}

	init();

	return {
		name,
		data,
		get isLoading() {
			return isLoading;
		},
		remove,
		wordGenerator
	}
}