import { dictionary } from "./dictionary.js";


export const WordEngine = (function() {
	let sortedDict = null;
	let font = null;
	let filter = "capitalised";
	let words = dictionary.languages.ukacd.words;

	function setFont(_font) {
		font = _font;
	}

	function setFilter(_filter) {
		filter = _filter;
	}

	function sort() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		ctx.font = `100px ${font.name}`;
		const sorted = {};

		for (let word of words) {
			let filteredWord = applyFilter(word);
			let width = Math.floor(ctx.measureText(filteredWord).width);
			if (sorted[width] === undefined) {
				sorted[width] = []
			}
			sorted[width].push(filteredWord)
		}
		
		sortedDict = sorted;
	}

	function applyFilter(string) {
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

	function getWord(size, width) {
		let tolerance = 5;
		let words = [];
		let scaledWidth = Math.round(width * (100 / size));

		if (size == 0) return '';

		for (let i = scaledWidth - tolerance; i <= scaledWidth + tolerance; i++) {
			if (sortedDict !== null && sortedDict[i] !== undefined) {
				words.push(...sortedDict[i]);	
			}
		}

		let randomIndex = Math.floor(Math.random()*words.length);
		return words[randomIndex] ?? "";
	}

	return {
		getWord,
		sort,
		setFont,
		setFilter
	}
})();

