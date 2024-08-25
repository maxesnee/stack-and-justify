import { hbjs } from './harfbuzzjs/hbjs.js';
import { Filters } from '../Filters.js';

let hbResolve;
let hbReady = new Promise((resolve) => {
	hbResolve = resolve;
});

WebAssembly.instantiateStreaming(fetch('harfbuzzjs/hb.wasm'), {})
	.then(instantiatedModule => {
		const hb = hbjs(instantiatedModule.instance);
		hb.exports = instantiatedModule.instance.exports;
		hbResolve(hb);
	});

onmessage = (e) => {
	hbReady.then(hb => {
		const fontBuffer = e.data[0];
		const words = e.data[1];
		const blob = hb.createBlob(fontBuffer);
		const face = hb.createFace(blob, 0);
		const font = hb.createFont(face);

		const sortedWords = measureWords(hb, words, font, 100);
		postMessage(sortedWords);
	});
};


function measureWords(hb, words, font, size) {
	const sortedWords = {};
	sortedWords.minWidth = Infinity;

	for (let filter of Filters) {
		sortedWords[filter.name] = {};

		for (let word of words) {
			let filteredWord = filter.apply(word);
			let width = Math.floor(measureText(filteredWord, font, size));
			if (sortedWords[filter.name][width] === undefined) {
				sortedWords[filter.name][width] = []
			}
			sortedWords[filter.name][width].push(filteredWord)

			if (width < sortedWords.minWidth) sortedWords.minWidth = width;
		}
	}

	function measureText(str, font, size) {
		const buffer = hb.createBuffer();
		buffer.addText(str);
		buffer.guessSegmentProperties();
		hb.shape(font, buffer);
		const result =  buffer.json();
		buffer.destroy();
		return (result.reduce((acc, curr) => acc + curr.ax, 0)/1000)*size;
	}

	return sortedWords;
}