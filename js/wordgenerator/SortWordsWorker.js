onmessage = async function(e) {
	const filters = ['lowercase', 'capitalised', 'uppercase'];
	const canvas = new OffscreenCanvas(0, 0);
	const ctx = canvas.getContext('2d');
	const sortedWords = {};
	sortedWords.minWidth = Infinity;
	const words = e.data[0];
	const fontName = e.data[1];
	const fontData = e.data[2];	
	const fontFeatures = e.data[3] || undefined;
	const fontFace = new FontFace(fontName, fontData, {
		featureSettings: fontFeatures
	});

	self.fonts.add(fontFace);
	await fontFace.load();

	ctx.font = `100px ${fontName}`;

	for (let filter of filters) {
		sortedWords[filter] = {};

		for (let word of words) {
			let filteredWord = applyFilter(word, filter);
			let width = Math.floor(ctx.measureText(filteredWord).width);
			if (sortedWords[filter][width] === undefined) {
				sortedWords[filter][width] = []
			}
			sortedWords[filter][width].push(filteredWord)

			if (width < sortedWords.minWidth) sortedWords.minWidth = width;
		}

		sortedWords.spaceWidth = Math.floor(ctx.measureText(' ').width);
	}
	postMessage(sortedWords);
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