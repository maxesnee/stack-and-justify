import { Words } from "./Words.js";
import { random, shuffle } from "./Helpers.js";

export const WordGenerator = function(fontName, fontData) {
	const filters = ["lowercase", "uppercase", "capitalised"];
	let sortedDict = null;

	async function sort() {
		let words = await Words.get();
		const sortDictionaryWorker = new Worker('./js/SortDictionaryWorker.js');
		sortDictionaryWorker.postMessage([words, fontName, fontData]);

		sortedDict = await new Promise(resolve => {
			sortDictionaryWorker.onmessage = (e) => {
				resolve(e.data);
			}
		});
	}

	async function getWords(size, width, filter) {
		let tolerance = 5;
		let words = [];
		let scaledWidth = Math.round(width * (100 / size));

		if (sortedDict === null) return words;

		let scaledSpaceWidth = Math.round(sortedDict.spaceWidth * (size / 100));

		for (let i = scaledWidth - tolerance; i <= scaledWidth; i++) {
			if (sortedDict[filter][i] !== undefined) {

				words.push(...sortedDict[filter][i]);	
			}
		}

		if (words.length == 0) {
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