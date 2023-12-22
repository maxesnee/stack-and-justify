export const Dictionary = (function() {
	const data = {
		languages: [{
			name: 'english',
			label: 'English',
			selected: true
		}, {
			name: 'french',
			label: 'French',
			selected: false
		}, {
			name: 'spanish',
			label: 'Spanish',
			selected: false
		}],
		sources: [{
			name: 'dictionary',
			label: 'Dictionary',
			selected: true,
			words: {
				english: {
					url: 'words/dictionaries/english.json',
					list: null
				},
				french: {
					url: 'words/dictionaries/french.json',
					list: null
				},
				spanish: {
					url: 'words/dictionaries/spanish.json',
					list: null
				},
			}
		}, {
			name: 'wikipedia',
			label: 'Wikipedia article titles',
			selected: false,
			words: {
				english: {
					url: 'words/wikipedia/en_wikipedia.json',
					list: null
				},
				french: {
					url: 'words/wikipedia/fr_wikipedia.json',
					list: null
				},
				spanish: {
					url: 'words/wikipedia/es_wikipedia.json',
					list: null
				}
			}
		}]
	}

	function loadFile(url) {
		return fetch(url)
			.then(response => response.json())
			.then(data => data.words)
			.catch(error => console.error('Error loading JSON file:', error));
	}

	async function getWords() {
		const words = [];
		for (const source of data.sources.filter(source => source.selected)) {
			for (const language of data.languages.filter(lang => lang.selected)) {
				const listObject = source.words[language.name];
				if (listObject.list === null) {
					listObject.list = await loadFile(listObject.url);
				}
				words.push(...listObject.list);
			}
		}
		return words;
	}


	return {
		getWords,
		data
	};

})();