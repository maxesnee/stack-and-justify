import { Words } from "./Words.js";
import { Layout } from "./Layout.js";
import { Fonts } from "./Fonts.js";
import { WorkerPool } from "./WorkerPool.js";
import { random, shuffle } from "./Helpers.js";

export const WordGenerator = function(fontName, fontData) {
	const filters = ["lowercase", "uppercase", "capitalised"];
	let sortedDict = null;

	async function sort() {
		let words = await Words.get();

		// The workers requires the OffscreenCanvas API
		if (window.OffscreenCanvas) {
			const result = WorkerPool.postMessage([words, fontName, fontData]);
			sortedDict = await result.then(e => e.data);
		} else {
			sortedDict = sortDictionary(words, fontName, fontData);
		}
	}

	async function getWords(size, width, filter) {
		let tolerance = 5;
		let words = [];
		let scaledWidth = Math.round(width * (100 / size));

		if (sortedDict === null) return words;

		let scaledSpaceWidth = Math.round(sortedDict.spaceWidth * (size / 100));

		// If the width is too short
		const widths = Object.keys(sortedDict[filter]).map(key => parseInt(key));
		const minWidth = Math.min(...widths);
		if (scaledWidth < minWidth) return words;

		// Find words within the given tolerance
		for (let i = scaledWidth - tolerance; i <= scaledWidth; i++) {
			if (sortedDict[filter][i] !== undefined) {
				words.push(...sortedDict[filter][i]);	
			}
		}
		if (words.length <= Layout.lines.length) {
			// If the width is too long, concatenate multiple words
			const randomWidth = Math.floor(random(width*0.15, width*0.667));
			const remainingWidth = width - randomWidth - scaledSpaceWidth;
			const firstWords = shuffle(await getWords(size, randomWidth, filter));
			const secondWords = shuffle(await getWords(size, remainingWidth, filter));

			const minLength = firstWords.length < secondWords.length ? firstWords.length : secondWords.length;
			for (let i = 0; i < minLength; i++) {	
				words.push(firstWords[i] + " " + secondWords[i]);
			}
		}
		return shuffle(words);
	}

	async function getLine(size, width, filter) {
		const words = await getWords(size, width, filter);

		const randomIndex = Math.floor(Math.random()*words.length);
		if (words[randomIndex]) {
			return words[randomIndex];	
		} else {
			return "";
		}
	}

	return {
		getWords,
		getLine,
		sort
	}
};

// This function is to be used if the OffscreenCanvas API (and thus, workers) is not available
function sortDictionary(words, fontName, fontData) {
	const filters = ['lowercase', 'capitalised', 'uppercase'];
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const sortedDict = {};
	// const fontFace = new FontFace(fontName, fontData);

	// self.fonts.add(fontFace);
	// await fontFace.load();

	ctx.font = `100px ${fontName}`;

	for (let filter of filters) {
		sortedDict[filter] = {};

		for (let word of words) {
			let filteredWord = applyFilter(word, filter);
			let width = Math.floor(ctx.measureText(filteredWord).width);
			if (sortedDict[filter][width] === undefined) {
				sortedDict[filter][width] = []
			}
			sortedDict[filter][width].push(filteredWord)
		}

		sortedDict.spaceWidth = Math.floor(ctx.measureText(' ').width);
	}
	return sortedDict;
}

function applyFilter(string, filter) {
	let filteredString = string;

	switch (filter) {
		case 'lowercase':
			filteredString = filteredString.toLowerCase()
			break;
		case 'capitalised':
			filteredString = filteredString[0].toUpperCase() + filteredString.slice(1);
			break;
		case 'uppercase':
			filteredString = filteredString.toUpperCase();
			break;
	}
	return filteredString;
}