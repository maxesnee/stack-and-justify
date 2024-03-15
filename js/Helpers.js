export async function handleFontFiles(files, callback) {
	const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

	files = Array.from(files);
	const validFiles = files.filter(file => file.name.match(acceptedExtensions));
	const loadedFonts = [];

	for (const file of validFiles) {
		const result = await handleFontFile(file);
		loadedFonts.push(result);
	}

	// Sort the fonts based on font infos (family name, weight and width class)
	const sortedFonts = sortFonts(loadedFonts);

	for (const font of sortedFonts) {
		callback(font.name, font.data, font.info);
	};
}

export function handleFontFile(file) {
	const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

	return new Promise((resolve, reject) => {
		if (!file.name.match(acceptedExtensions)) {
			reject("Could not upload file: wrong extension");
		}

		// Removes file extension from name
		let fileName = file.name.replace(/\..+$/, "");
		// Replace any non alpha numeric characters with -
		fileName = fileName.replace(/\W+/g, "-");
	
		const reader = new FileReader();

		reader.onloadend = function(e) {
			const info = getFontInfos(e.target.results);

			resolve({
				name: info.fullName,
				data: e.target.result,
				info
			});
		}

		reader.readAsArrayBuffer(file);
	});
}

function getFontInfos(fontBuffer) {
	const font = Typr.parse(fontBuffer)[0];
	const fsSelection = font["OS/2"].fsSelection.toString(2).padStart(16, "0").split('').reverse();
	const familyName = font.name.typoFamilyName || font.name.fontFamily;
	const subfamilyName = font.name.typoSubfamilyName || font.name.fontSubfamily;
	const fullName = familyName + ' ' + subfamilyName;

	return  {
		fullName,
		familyName,
		subfamilyName,
		fileName,
		isItalic: fsSelection[0] === "0" ? false : true,
		weightClass: font["OS/2"].usWeightClass,
		widthClass: font["OS/2"].usWidthClass
	}
}

export function sortFonts(list) {
	if (list.length <= 1) return list;

	const sortedFonts = list;

	// Sort regular/italic pairs
	sortedFonts.sort((fontA, fontB) => {
		if (fontA.info.isItalic && !fontB.info.isItalic) {
			return 1
		} else if (!fontA.info.isItalic && fontB.info.isItalic) {
			return -1
		} else {
			return 0;
		}
	});

	// Sort by weight
	sortedFonts.sort((fontA, fontB) => {
		return fontA.info.weightClass - fontB.info.weightClass;
	});

	// Sort by width
	sortedFonts.sort((fontA, fontB) => {
		return fontA.info.widthClass - fontB.info.widthClass;
	});

	// Sort by family name
	sortedFonts.sort((fontA, fontB) => {
		return fontA.info.familyName.localeCompare(fontB.info.familyName);
	});

	return sortedFonts;
}

export function random(min, max) {
	return Math.random() * (max - min) + min;
}

export function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}

	return array;
}

export function generateUID() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}
