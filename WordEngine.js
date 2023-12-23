import { Dictionary } from "./Dictionary.js";
import { random, shuffle } from "./Helpers.js";


export const WordEngine = (function() {
	const filters = ["lowercase", "uppercase", "capitalised"];
	let sortedDict = null;
	let font = null;

	function setFont(_font) {
		font = _font;
	}

	async function sort() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		ctx.font = `100px ${font.name}`;
		sortedDict = {};
		let words = await Dictionary.getWords();

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

	async function getWords(size, width, filter) {
		let tolerance = 5;
		let words = [];
		let scaledWidth = Math.round(width * (100 / size));

		if (sortedDict === null) return words;

		sortedDict = await sortedDict;

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
		sort,
		setFont
	}
})();

