const specimen = document.querySelector('.specimen');
const font = "Scopra";
const fontWeight = '';
const dictionaries = [titles, dictionary.languages.french.words];

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