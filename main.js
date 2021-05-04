const specimen = document.querySelector('.specimen');
// const canvas = document.createElement('canvas');
// const ctx = canvas.getContext('2d');
const font = "Scopra";
const fontWeight = '';
// const targetWidth = 320;
// const wordCount = 10;
// const layout = [72, 64, 56, 48, 36, 30];
const dictionaries = [titles, dictionary.languages.french.words];

// for (let i = 0; i < layout.length; i++) {
// 	ctx.font = fontWeight + ' ' + layout[i] + "px " + font;

// 	let text = getRandomText(dictionaries);
// 	let textWidth = Math.round(ctx.measureText(text.string).width);

// 	while (textWidth < targetWidth - 2 || textWidth > targetWidth + 2) {
// 		dictionaries[text.dictIndex].splice(text.index, 1);
		
// 		text = getRandomText(dictionaries);
// 		textWidth = Math.round(ctx.measureText(text.string).width);
// 	}

// 	const textEl = document.createElement('span');
// 	textEl.innerText = text.string;
// 	textEl.style.fontSize = layout[i] + 'px';
// 	textEl.style.fontWeight = fontWeight;
// 	specimen.appendChild(textEl);

// 	dictionaries[text.dictIndex].splice(text.index, 1);
// }

// specimen.style.display = 'flex';
// specimen.style.flexDirection = 'column';


function getRandomText(dictionaries) {
	const dictIndex = Math.floor(Math.random() * dictionaries.length);
	const dictionary = dictionaries[dictIndex];
	const index = Math.floor(Math.random() * dictionary.length);
	const text = dictionary[index];
	return {
		string: text,
		index: index,
		dictIndex: dictIndex
	};
}

function getRandomIdiom() {
	const index = Math.floor(Math.random() * idioms.length);
	const word = idioms[index];
	return {
		string: word,
		index: index
	};
}


function getRandomTitle() {
	const index = Math.floor(Math.random() * titles.length)
	const word = titles[index];
	return {
		string: word,
		index: index
	};
}

function getRandomWord() {
	const language = dictionary.languages.ukacd;
	const index = Math.floor(Math.random() * language.words.length);
	const word = language.words[index];
	return {
		string: word,
		index: index
	};
}

// function getRandomWord() {
// 	const languageNo = Math.floor(Math.random() * Object.keys(dictionary.languages).length);
// 	const language = dictionary.languages[Object.keys(dictionary.languages)[languageNo]];
// 	const word = language.words[Math.floor(Math.random() * language.words.length)];
// 	return word;
// }