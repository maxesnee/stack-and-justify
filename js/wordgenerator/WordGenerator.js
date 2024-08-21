import { WorkerPool } from "./WorkerPool.js";

export const WordGenerator = function(fontName, fontData) {
	const filters = ["lowercase", "uppercase", "capitalised"];
	let sortedWords = null;

	async function sort(words, fontFeaturesSettings) {
		// The workers requires the OffscreenCanvas API
		if (window.OffscreenCanvas) {
			const result = WorkerPool.postMessage([words, fontName, fontData, fontFeaturesSettings]);
			sortedWords = await result.then(e => e.data);
		} else {
			sortedWords = sortWords(words, fontName, fontData, fontFeaturesSettings);
		}
	}

	// This function is to be used if the OffscreenCanvas API (and thus, workers) is not available
	function sortWords(words, fontName, fontData, fontFeatures) {
		const filters = ['lowercase', 'capitalised', 'uppercase'];
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const sortedWords = {};
		sortedWords.minWidth = Infinity;

		ctx.font = `100px ${fontName}`;

		for (let filter of filters) {
			sortedWords[filter] = {};

			for (let word of words) {
				let filteredWord = applyFilter(word, filter);
				let width = Math.floor(ctx.measureText(filteredWord).width);
				if (sortedWords[filter][width] === undefined) {
					sortedWords[filter][width] = []
				}
				sortedWords[filter][width].push(filteredWord);

				if (width < minWidth) sortedWords.minWidth = width;
			}

			sortedWords.spaceWidth = Math.floor(ctx.measureText(' ').width);
		}
		return sortedWords;
	}

	function getWords(size, width, filter, minWords=16) {
		let tolerance = 5;
		let words = [];
		let scaledWidth = Math.round(width * (100 / size));

		if (sortedWords === null || scaledWidth < sortedWords.minWidth) {
			return words;
		};

		let scaledSpaceWidth = Math.round(sortedWords.spaceWidth * (size / 100));

		// Find words within the given tolerance
		for (let i = scaledWidth - tolerance; i <= scaledWidth; i++) {
			if (sortedWords[filter][i] !== undefined) {
				words.push(...sortedWords[filter][i]);	
			}
		}

		if (words.length <= minWords) {
			// If the width is too long, concatenate multiple words
			const randomWidth = Math.floor(random(width*0.15, width*0.667));
			const remainingWidth = width - randomWidth - scaledSpaceWidth;
			const firstWords = shuffle(getWords(size, randomWidth, filter));
			const secondWords = shuffle(getWords(size, remainingWidth, filter));

			const minLength = firstWords.length < secondWords.length ? firstWords.length : secondWords.length;
			for (let i = 0; i < minLength; i++) {	
				words.push(firstWords[i] + " " + secondWords[i]);
			}
		}

		return shuffle(words);
	}

	return {
		getWords,
		sort
	}
};

export function random(min, max) {
	return Math.random() * (max - min) + min;
}

export function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}

	return array;
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