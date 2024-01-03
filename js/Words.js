export const Words = (function() {
	const languages = [
		{
			name: 'catalan',
			label: 'Catalan',
			code: 'ca',
			selected: false
		}, {
			name: 'czech',
			label: 'Czech',
			code: 'cs',
			selected: false
		}, {
			name: 'danish',
			label: 'Danish',
			code: 'da',
			selected: false
		}, {
			name: 'dutch',
			label: 'Dutch',
			code: 'nl',
			selected: false
		}, {
			name: 'english',
			label: 'English',
			code: 'en',
			selected: true
		}, {
			name: 'finnish',
			label: 'Finnish',
			code: 'fi',
			selected: false
		}, {
			name: 'french',
			label: 'French',
			code: 'fr',
			selected: false
		}, {
			name: 'german',
			label: 'German',
			code: 'de',
			selected: false
		}, {
			name: 'hungarian',
			label: 'Hungarian',
			code: 'hu',
			selected: false
		}, {
			name: 'icelandic',
			label: 'Icelandic',
			code: 'is',
			selected: false
		}, {
			name: 'italian',
			label: 'Italian',
			code: 'it',
			selected: false
		}, {
			name: 'latin',
			label: 'Latin',
			code: 'la',
			selected: false
		}, {
			name: 'norwegian',
			label: 'Norwegian',
			code: 'no',
			selected: false
		}, {
			name: 'polish',
			label: 'Polish',
			code: 'pl',
			selected: false
		}, {
			name: 'slovak',
			label: 'Slovak',
			code: 'sk',
			selected: false
		}, {
			name: 'spanish',
			label: 'Spanish',
			code: 'es',
			selected: false
		}
	];

	const sources = [
		{
			name: 'dictionary',
			label: 'Dictionary',
			selected: true,
			words: (function() {
				const obj = {};
				languages.forEach(language => {
					obj[language.name] = {
						url: `words/dictionaries/${language.name}.json`,
						list: null
					}
				});
				return obj;
			})()
		}, {
			name: 'wikipedia',
			label: 'Wikipedia article titles',
			selected: false,
			words: (function() {
				const obj = {};
				languages.forEach(language => {
					obj[language.name] = {
						url: `words/wikipedia/${language.code}_wikipedia.json`,
						list: null
					}
				});
				return obj;
			})()
		}
	]

	function loadFile(url) {
		return fetch(url)
			.then(response => response.json())
			.then(data => data.words)
			.catch(error => console.error('Error loading JSON file:', error));
	}

	async function get() {
		let words = [];
		for (const source of sources.filter(source => source.selected)) {
			for (const language of languages.filter(lang => lang.selected)) {
				const listObject = source.words[language.name];
				if (listObject.list === null) {
					listObject.list = await loadFile(listObject.url);
				}
				words = words.concat(listObject.list);
			}
		}
		return words;
	}


	return {
		get,
		data: {
			languages,
			sources
		}
	};

})();