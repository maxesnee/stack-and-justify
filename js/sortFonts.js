const testsList = {
	"Univers": ["UniversLTStd-ThinUltraCn.otf","UniversLTStd-LightUltraCn.otf","UniversLTStd-UltraCn.otf","UniversLTStd-LightCn.otf","UniversLTStd-LightCnObl.otf","UniversLTStd-Cn.otf","UniversLTStd-CnObl.otf","UniversLTStd-BoldCn.otf","UniversLTStd-BoldCnObl.otf","UniversLTStd-Light.otf","UniversLTStd-LightObl.otf","UniversLTStd.otf","UniversLTStd-Obl.otf","UniversLTStd-Bold.otf","UniversLTStd-BoldObl.otf","UniversLTStd-Black.otf","UniversLTStd-BlackObl.otf","UniversLTStd-XBlack.otf","UniversLTStd-XBlackObl.otf","UniversLTStd-Ex.otf","UniversLTStd-ExObl.otf","UniversLTStd-BoldEx.otf","UniversLTStd-BoldExObl.otf","UniversLTStd-BlackEx.otf","UniversLTStd-BlackExObl.otf","UniversLTStd-XBlackEx.otf","UniversLTStd-XBlackExObl.otf"],
	"HelveticaNeue": ["HelveticaNeueLTStd-ThCn.otf","HelveticaNeueLTStd-ThCnO.otf","HelveticaNeueLTStd-UltLtCn.otf","HelveticaNeueLTStd-UltLtCnO.otf","HelveticaNeueLTStd-LtCn.otf","HelveticaNeueLTStd-LtCnO.otf","HelveticaNeueLTStd-Cn.otf","HelveticaNeueLTStd-CnO.otf","HelveticaNeueLTStd-MdCn.otf","HelveticaNeueLTStd-MdCnO.otf","HelveticaNeueLTStd-BdCn.otf","HelveticaNeueLTStd-BdCnO.otf","HelveticaNeueLTStd-HvCn.otf","HelveticaNeueLTStd-HvCnO.otf","HelveticaNeueLTStd-BlkCn.otf","HelveticaNeueLTStd-BlkCnO.otf","HelveticaNeueLTStd-XBlkCn.otf","HelveticaNeueLTStd-XBlkCnO.otf","HelveticaNeueLTStd-Th.otf","HelveticaNeueLTStd-ThIt.otf","HelveticaNeueLTStd-UltLt.otf","HelveticaNeueLTStd-UltLtIt.otf","HelveticaNeueLTStd-Lt.otf","HelveticaNeueLTStd-LtIt.otf","HelveticaNeueLTStd-Roman.otf","HelveticaNeueLTStd-It.otf","HelveticaNeueLTStd-Md.otf","HelveticaNeueLTStd-MdIt.otf","HelveticaNeueLTStd-Bd.otf","HelveticaNeueLTStd-BdIt.otf","HelveticaNeueLTStd-Hv.otf","HelveticaNeueLTStd-HvIt.otf","HelveticaNeueLTStd-Blk.otf","HelveticaNeueLTStd-BlkIt.otf","HelveticaNeueLTStd-ThEx.otf","HelveticaNeueLTStd-ThExO.otf","HelveticaNeueLTStd-UltLtEx.otf","HelveticaNeueLTStd-UltLtExO.otf","HelveticaNeueLTStd-LtEx.otf","HelveticaNeueLTStd-LtExO.otf","HelveticaNeueLTStd-Ex.otf","HelveticaNeueLTStd-ExO.otf","HelveticaNeueLTStd-MdEx.otf","HelveticaNeueLTStd-MdExO.otf","HelveticaNeueLTStd-BdEx.otf","HelveticaNeueLTStd-BdExO.otf","HelveticaNeueLTStd-HvEx.otf","HelveticaNeueLTStd-HvExO.otf","HelveticaNeueLTStd-BlkEx.otf","HelveticaNeueLTStd-BlkExO.otf"],
	"Gotham": ["Gotham-Thin.otf","Gotham-ThinItalic.otf","Gotham-XLight.otf","Gotham-XLightItalic.otf","Gotham-Light.otf","Gotham-LightItalic.otf","Gotham-Book.otf","Gotham-BookItalic.otf","Gotham-Medium.otf","Gotham-MediumItalic.otf","Gotham-Bold.otf","Gotham-BoldItalic.otf","Gotham-Black.otf","Gotham-BlackItalic.otf","Gotham-Ultra.otf","Gotham-UltraItalic.otf"],
	"MuseoSans": ["MuseoSans-100.otf","MuseoSans-100Italic.otf","MuseoSans-300.otf","MuseoSans-300Italic.otf","MuseoSans_500.otf","MuseoSans_500_Italic.otf","MuseoSans_700.otf","MuseoSans-700Italic.otf","MuseoSans_900.otf","MuseoSans-900Italic.otf"],
	"Ubuntu": ["UbuntuMono-R.ttf", "UbuntuMono-RI.ttf", "UbuntuMono-B.ttf", "UbuntuMono-BI.ttf",],
	"Montserrat": ["Montserrat-Thin.ttf","Montserrat-ThinItalic.ttf","Montserrat-ExtraLight.ttf","Montserrat-ExtraLightItalic.ttf","Montserrat-Light.ttf","Montserrat-LightItalic.ttf","Montserrat-Regular.ttf","Montserrat-Italic.ttf","Montserrat-Medium.ttf","Montserrat-MediumItalic.ttf","Montserrat-SemiBold.ttf","Montserrat-SemiBoldItalic.ttf","Montserrat-Bold.ttf","Montserrat-BoldItalic.ttf","Montserrat-ExtraBold.ttf","Montserrat-ExtraBoldItalic.ttf","Montserrat-Black.ttf","Montserrat-BlackItalic.ttf"],
	"SourceCode": ["SourceCodePro-ExtraLight.otf","SourceCodePro-ExtraLightIt.otf","SourceCodePro-Light.otf","SourceCodePro-LightIt.otf","SourceCodePro-Regular.otf","SourceCodePro-It.otf","SourceCodePro-Medium.otf","SourceCodePro-MediumIt.otf","SourceCodePro-Semibold.otf","SourceCodePro-SemiboldIt.otf","SourceCodePro-Bold.otf","SourceCodePro-BoldIt.otf","SourceCodePro-Black.otf","SourceCodePro-BlackIt.otf"],
	"GamuthText": ["GamuthText-ExtraLight.otf", "GamuthText-ExtraLightItalic.otf", "GamuthText-Light.otf", "GamuthText-LightItalic.otf", "GamuthText-Regular.otf", "GamuthText-Italic.otf", "GamuthText-Medium.otf", "GamuthText-MediumItalic.otf", "GamuthText-Bold.otf", "GamuthText-BoldItalic.otf", "GamuthText-Black.otf", "GamuthText-BlackItalic.otf"]
};

function runTests() {
	for (const test in testsList) {
		const list = testsList[test];

		const shuffledList = list.toSorted(() => Math.random() - 0.5);
		const sortedList = sortFontStyles(shuffledList);
		const result = JSON.stringify(list) === JSON.stringify(sortedList);
		console.log(`${test}: ${result ? '✅' : '❌'}`);
	};
}

const FontStyles = (function() {
	// Initially based on: https://gist.github.com/quitequinn/601e234980b1aa563dba194fa1125e50
	const coreCondensedStyles = ["compressed", "condensed", "narrow"];
	const coreExtendedStyles = ["extended", "expanded", "wide"];
	const coreLightWeights = ["hairline", "thin", "mager", "maigre", "light", "chiaro", "lite", "leicht"];
	const coreRegularWeights = ["demi", "book", "buch", "regular", "normal", "medium"];
	const coreBoldWeights = ["thick", "kräftig", "viertelfett", "halbfett", "dreiviertelfett", "dark", "bold", "neretto", "gras", "fett", "heavy", "black", "nero", "nerissimo", "fat", "ultra"];
	const italics = ["italic", "slant", "oblique", "cursive", "rotalic"];
	const reduceModifiers = ["demi", "semi"];
	const increaseModifiers = ["extra", "ultra", "super", "giga"];
	const alternativeSpelling = {
		Extended: ["Ex"],
		Condensed: ["Cn", "Cond"],
		Thin: ["Thn", "Th", "100"],
		Extralight: ["200"],
		Light: ["Lt", "Lght", "300"],
		Regular: ["R", "Reg", "Rg", "Roman", "400"],
		Medium: ["Md", "500"],
		Dark: ["Drk", "600"],
		Bold: ["Bd", "Bld", "B", "700"],
		Heavy: ["Hv", "800"],
		Black: ["Blak", "Blk", "900"],
		Extra: ["X", "Xt"],
		Ultra: ["Ult", "Ultre", "Ul", "Ulta"],
		Super: ["Supr"],
		Italic: ["Ital", "It", "I"],
		Oblique: ["Obl", "O"],
		Slant: ["Sl"],
		Cursive: ["Cur"],
		Rotalic: ["Rot"]
	};

	const allWeights = (function() {
		const weights = [];
		// Light weights
		// In light weights the order of the modififiers is reversed
		// eg: ExtraLight is lighter than SemiLight, so should come first in the list
		coreLightWeights.forEach(weight => {
			increaseModifiers.toReversed().forEach(modifier => {
				weights.push(`${modifier}${weight}`);
			});
			weights.push(weight);
			reduceModifiers.toReversed().forEach(modifier => {
				weights.push(`${modifier}${weight}`);
			});
		});

		// Regular weights
		weights.push(...coreRegularWeights);

		// Bold weights
		coreBoldWeights.forEach(weight => {
			reduceModifiers.forEach(modifier => {
				weights.push(`${modifier}${weight}`);
			});
			weights.push(weight);
			increaseModifiers.forEach(modifier => {
				weights.push(`${modifier}${weight}`);
			});
		});
		return weights;
	})();

	const allWidths = (function() {
		const widths = [];
		// Condensed styles
		// Same as for light weights, order of the modififiers is reversed
		// eg: ExtraCondensed should be before Condensed
		coreCondensedStyles.forEach(width => {
			increaseModifiers.toReversed().forEach(modifier => {
				widths.push(`${modifier}${width}`);
			});
			widths.push(width);
			reduceModifiers.toReversed().forEach(modifier => {
				widths.push(`${modifier}${width}`);
			});
		});

		// Not a real style name but useful to have in the list for sorting puposes
		widths.push('normal');

		// Extended styles
		coreExtendedStyles.forEach(width => {
			reduceModifiers.forEach(modifier => {
				widths.push(`${modifier}${width}`);
			});
			widths.push(width);
			increaseModifiers.forEach(modifier => {
				widths.push(`${modifier}${width}`);
			});
		});
		return widths;
	})();

	return {
		italics: italics,
		weights: allWeights,
		widths: allWidths,
		alternativeSpelling
	}
})();

export function sortFonts(list) {
	if (list.length <= 1) return list;

	const styleNames = list.map(font => font.name);
	const sortedNames = sortFontStyles(styleNames);

	const sortedFonts = sortedNames.map(name => {
		return list.find(font => font.name === name);
	});

	return sortedFonts;
}

export function sortFontStyles(styleNames) {
	let output = [];

	// Sort by family name in case of multiple families
	const families = sortByFontName(styleNames);

	for (const family in families) {
		const styleNames = families[family];
		const commonPrefix = findCommonPrefix(styleNames);

		// Extract the weight, width and italic from every name
		const styles = styleNames.map(styleName => {
			const originalName = styleName;
			let italic;
			let weight;
			let width;
			const weightMatches = [];
			const widthMatches = [];

			// Remove the common prefix (family name)
			styleName = styleName.replace(commonPrefix, "");

			// Normalize alternative spellings
			styleName = normalizeSpelling(styleName);

			// Ignore case
			styleName = styleName = styleName.toLowerCase();

			// Italics
			FontStyles.italics.forEach(name => {
				if (styleName.includes(name)) {
					italic = name;
				}
			});
			styleName = styleName.replace(italic, "");


			// Widths
			FontStyles.widths.forEach(width => {
				// Ignore "normal" as it is only in the list for sorting purposes
				if (width === "normal") return false;

				if (styleName.includes(width)) {
					widthMatches.push(width);
				}
			});

			// Use the longest width name to give priority to names like 'extracondensed' over 'condensed'
			if (widthMatches.length > 0) {
				width = getLongest(widthMatches);
			} else {
				width = "normal";
			}
			styleName = styleName.replace(width, "");


			// Weights
			FontStyles.weights.forEach(weight => {
				if (styleName.includes(weight)) {
					// if (weight === "ultra" && widthMatches.some(width => width.includes("ultra"))) return;

					weightMatches.push(weight);
				}
			});

			// Use the longest weight name to give priority to names like 'extrabold' over 'bold'
			if (weightMatches.length > 0) {
				weight = getLongest(weightMatches);
			} else {
				weight = "regular";
			}
			styleName.replace(weight, "");

			return {
				name: originalName,
				width,
				weight,
				italic,
			}
		});

		// Sort by weights
		styles.sort((a, b) => {
			return FontStyles.weights.indexOf(a.weight) - FontStyles.weights.indexOf(b.weight);
		});

		// Sort by widths
		styles.sort((a, b) => {
			return FontStyles.widths.indexOf(a.width) - FontStyles.widths.indexOf(b.width);
		});

		// Place italics after roman
		styles.sort((a, b) => {
			if (a.weight === b.weight && a.width === b.width) {
				if (a.italic !== undefined && b.italic === undefined) {
					return 1;
				}
			}
			return 0;
		});

		families[family] = styles.map(style => style.name);
	};

	// Output a sorted list of style names
	for (const family in families) {
		output.push(...families[family]);
	}

	return output;
}

function normalizeSpelling(styleName) {
	for (const propName in FontStyles.alternativeSpelling) {
		const alts = FontStyles.alternativeSpelling[propName];
		alts.forEach(alt => {
			// Exception for "B" as it is also present in "Black"
			// TODO: Refactor this ugly one liner
			if (alt === "B" && ["Bold", "Black", "Book", ...FontStyles.alternativeSpelling["Black"]].some(n => styleName.includes(n))) {
				return;
			}

			// Exception for "Ex" as it is also present in "Extra"
			if (alt === "Ex" && ["Extra", "Extended"].some(n => styleName.includes(n))) {
				return;
			}

			if (!styleName.includes(propName) && styleName.includes(alt)) {
				styleName = styleName.replace(alt, propName);	
			}
		})
	}
	return styleName;
}

function getLongest(arr) {
	return arr.reduce(
		function (a, b) {
			return a.length > b.length ? a : b;
		}
		);	
}

// Source: https://gist.github.com/JeffJacobson/3841577
// Split camel-case or Pascal-case into individual words
function splitWords(s) {
	var re, match, output = [];
	re = /([A-Za-z\-\_\.]?)([a-z\-]+)/g;

	match = re.exec(s);
	while (match) {
		output.push([match[1], match[2]].join(""));
		match = re.exec(s);
	}

	return output;
}

function sortByFontName(arr) {
	const fonts = {};

	for (let name of arr) {
		const fontName = name.split(/-|_/)[0];
		if (!fonts[fontName]) fonts[fontName] = [];
		fonts[fontName].push(name);
	}

	return fonts;
}

function findCommonPrefix(arr) {
	let found = true;
	const prefix = arr[0].split('').reduce(function(r, e, i) {
		const check = arr.every(elem => elem[i] == e);
		check && found ? r += e : found = false;
		return r;
	}, '')

	return prefix;
}

if (![].toReversed) {
	Array.prototype.toReversed = function () {
		for (var i=(this.length - 1),arr=[]; i>=0; --i) {
			arr.push(this[i]);
		}
		return arr;
	};
}