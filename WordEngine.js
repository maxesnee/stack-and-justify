import { Dictionary } from "./Dictionary.js";


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

async function getWord(size, width, filter) {
		let tolerance = 5;
		let words = [];
		let scaledWidth = Math.round(width * (100 / size));

		if (size == 0) return '';
		if (sortedDict == null) return '';

		sortedDict = await sortedDict;

		for (let i = scaledWidth - tolerance; i <= scaledWidth; i++) {
			if (sortedDict[filter][i] !== undefined) {
				words.push(...sortedDict[filter][i]);	
			}
		}

		let randomIndex = Math.floor(Math.random() * words.length);
		return words[randomIndex] ?? "";
	}

	return {
		getWord,
		sort,
		setFont
	}
})();

