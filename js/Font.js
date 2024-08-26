import { Words } from "./Words.js";
import { WordGenerator } from "./wordgenerator/WordGenerator.js";
import { Layout } from "./Layout.js";
import { generateUID, Computed } from "./Helpers.js";

export const Font = function(name, data, info) {
	const id = generateUID();
	const fontFaceName = info.fileName;
	const features = [];
	const fontFeatureSettings = Computed(() => generateFontFeatureSettings(features));
	const displayFeatureSettings = Computed(() => fontFeatureSettings.val);
	const wordGenerator = WordGenerator(fontFaceName, data);
	let isLoading = true;

	async function load() {
		const fontFace = new FontFace(fontFaceName, data);
		document.fonts.add(fontFace);

		await fontFace.load();

		update();
	}

	async function update() {
		isLoading = true;
		const words = await Words.get();
		fontFeatureSettings.update();

		try {
			await wordGenerator.sort(words, fontFeatureSettings.val);
		} catch (error) {
			console.log(error);
		}

		displayFeatureSettings.update();

		// Dispatch event
		const event = new CustomEvent("font-loaded", {detail: {font}});
		window.dispatchEvent(event);

		isLoading = false;
	}

	const font = {
		name,
		fontFaceName,
		data,
		info,
		features,
		fontFeatureSettings: displayFeatureSettings,
		id,
		load,
		update,
		wordGenerator,
		get isLoading() {
			return isLoading;
		},
	}

	return font;
}

function generateFontFeatureSettings(features) {
	let str = "";
	let featureStrings = [];

	for (let feature of features) {
		if (feature.selected) {
			featureStrings.push(`"${feature.tag}" on`);
		} else {
			featureStrings.push(`"${feature.tag}" off`);
		}
	}

	str = featureStrings.join(',');
	return str;
}