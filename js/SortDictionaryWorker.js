onmessage = async function(e) {
	const filters = ['lowercase', 'capitalised', 'uppercase'];
	const canvas = new OffscreenCanvas(0, 0);
	const ctx = canvas.getContext('2d');
	const sortedDict = {};
	const words = e.data[0];
	const fontName = e.data[1];
	const fontData = e.data[2];	
	const fontFace = new FontFace(fontName, fontData);

	self.fonts.add(fontFace);
	await fontFace.load();

	ctx.font = `100px ${fontName}`;

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
	postMessage(sortedDict);
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