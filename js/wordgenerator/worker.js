import { hbjs } from '../harfbuzzjs/hbjs.js';
import { Filters } from '../Filters.js';

let hb;

onmessage = async function(e) {
	if (e.data.type === 'load-module') {
		const hbModule = e.data.module;
		hb = await WebAssembly.instantiate(hbModule, {}).then((instance) => {	
			return hbjs(instance);
		});
	}
	if (e.data.type === 'sort') {
		const words = e.data.words;
		const fontBuffer = e.data.fontBuffer;
		const fontFeaturesSettings = e.data.fontFeaturesSettings;
		const blob = hb.createBlob(fontBuffer)
		const face = hb.createFace(blob, 0);
		const font = hb.createFont(face);

		const sortedWords = measureWords(words, font, 100, fontFeaturesSettings);
		postMessage(sortedWords);
	}
};


function measureWords(words, font, size, fontFeaturesSettings) {
	const scale = 1/(1000/size);
	const sortedWords = {};
	sortedWords.minWidth = Infinity;
	font.setScale(1000, 1000);

	for (let filter of Filters) {
		sortedWords[filter.name] = {};

		for (let word of words) {
			let filteredWord = filter.apply(word);
			let width = Math.floor(measureText(filteredWord, font, scale, fontFeaturesSettings));
			if (sortedWords[filter.name][width] === undefined) {
				sortedWords[filter.name][width] = []
			}
			sortedWords[filter.name][width].push(filteredWord)

			if (width < sortedWords.minWidth) sortedWords.minWidth = width;
		}

		sortedWords.spaceWidth = Math.floor(measureText(' ', font, scale, fontFeaturesSettings));
	}

	return sortedWords;
}

function measureText(str, font, scale, fontFeaturesSettings) {
	const buffer = hb.createBuffer();
	buffer.addText(str);
	buffer.guessSegmentProperties();
	hb.shape(font, buffer, fontFeaturesSettings);
	const result =  buffer.json();
	buffer.destroy();
	return result.reduce((acc, curr) => acc + curr.ax, 0)*scale;
}