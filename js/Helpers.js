import { sortFontStyles } from './sortFonts.js';

export function handleFontFiles(files, callback) {
	const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

	files = Array.from(files);
	let validFiles = files.filter(file => file.name.match(acceptedExtensions));

	// Sort the font files
	const fileNames = validFiles.map(file => file.name);
	let sortedNames = sortFontStyles(fileNames);
	let sortedFiles = sortedNames.map(name => validFiles.find(file => file.name === name));
	
	sortedFiles.forEach(file => handleFontFile(file, callback))
}

export function handleFontFile(file, callback) {
	const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

	if (!file.name.match(acceptedExtensions)) {
		return;
	}

	// Removes file extension from name
	let fileName = file.name.replace(/\..+$/, "");
	// Replace any non alpha numeric characters with -
	fileName = fileName.replace(/\W+/g, "-");

	const reader = new FileReader();

	reader.onloadend = function(e) {
		let data = e.target.result;
		callback(fileName, data);
	}

	reader.readAsArrayBuffer(file);
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
