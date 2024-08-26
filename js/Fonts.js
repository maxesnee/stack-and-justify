import { parse, getFontInfo } from './miniotparser/MiniOTParser.js';
import { Font } from './Font.js';
import { Feature } from './Feature.js';
import { generateUID } from './Helpers.js';

export const Fonts = (function() {
	const list = [];

	function add(font) {
		// Group the font by family name
		let family = list.find(family => family.name === font.info.familyName);

		// If the family group doesn't already exist, create it
		if (!family) {
			family = {
				id: generateUID(font.info.familyName),
				name: font.info.familyName,
				list: [],
				features: font.info.features.map(feature => Feature(feature.tag, feature.name))
			};
			list.push(family);
		}

		// Add the features that were not already present in the list
		// We allow for duplicate features only if they have different names
 		// This allow for multiple version of the same stylistic sets inside a family
		font.info.features.forEach(featureInfo => {
			let feature = family.features.find(_feature => _feature.name === featureInfo.name);

			if (!feature) {
				feature = Feature(featureInfo.tag, featureInfo.name);
				family.features.push(feature);	
			}
			// We also add a reference to the feature in the font object
			font.features.push(feature);
		});

		// Push the font in the family list
		family.list.push(font);

		// Sort by style
		sortFonts(family.list);

		// Start sorting the dictionnary
		font.load();

		// Dispatch event
		const event = new CustomEvent("font-added", {detail: {font: font}});
		window.dispatchEvent(event);
	}

	function find(fontId) {
		for (let family of list) {
			for (let font of family.list) {
				if (font.id === fontId) {
					return font;
				}
			}
		}
	}

	// Get form data from the Features menu and activate/desactivate 
	// the corresponding features in the list.
	// Then, update the fonts that includes one the updated features.
	function updateFeatures(formData) {
		for (let family of list) {
			if (formData.has(family.id)) {
				const updatedFeatures = [];

				const selectedFeatures = formData.getAll(family.id);
				for (let feature of family.features) {
					if (selectedFeatures.includes(feature.id) && !feature.selected) {
						// The feature has been activated
						feature.selected = true;
						updatedFeatures.push(feature);
						
					} else if (!selectedFeatures.includes(feature.id) && feature.selected) {
						// The feature has been desactivated
						feature.selected = false;
						updatedFeatures.push(feature);
						
					}
				}

				for (let font of family.list) {
					let needsUpdate = false;
					for (let feature of updatedFeatures) {
						if (font.features.includes(feature)) {
							needsUpdate = true;	
						}
					}
					if (needsUpdate) font.update();
				}
			}
		}
	}

	return {
		list,
		add,
		find,
		updateFeatures,
		get length() {
			return list.reduce((acc, curr) => acc + curr.list.length, 0);
		}
	}

})();

export function handleFontFiles(files) {
	const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

	files = Array.from(files);
	const validFiles = files.filter(file => file.name.match(acceptedExtensions));

	const loadedFonts = validFiles.map(loadFontFile);

	Promise.all(loadedFonts).then(fonts => {
		sortFonts(fonts);

		fonts.forEach(Fonts.add);
	});
}

export function loadFontFile(file) {

	return new Promise((resolve, reject) => {
		// Removes file extension from name
		let fileName = file.name.replace(/\..+$/, "");
		// Replace any non alpha numeric characters with -
		fileName = fileName.replace(/\W+/g, "-");
		// Remove leading digits in the filename
		fileName = fileName.replace(/^[0-9]+/g, '');
	
		const reader = new FileReader();

		reader.onloadend = function(e) {
			const fontInfo = getFontInfo(parse(e.target.result), fileName);
			// Check if a font with the same name does not exists already
			if (Fonts.find(font => font.name === fontInfo.fullName)) {
				reject();
			}

			resolve(Font(fontInfo.fullName, e.target.result, fontInfo));
		}

		reader.readAsArrayBuffer(file);
	});
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