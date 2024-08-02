/* Mini OpenType Parser
 * 
 * This is not a proper OpenType parser, please don't use it.
 * If you want an actual OpenType JS library, check opentype.js or Typr.js
 * 
 * I made this because I only needed a handful of entries from the 'name', 'OS/2' 
 * and 'GPOS' table and parsing the entire font seemed wasteful and was actually slow
 * with opentype.js. Typr.js is faster but doesn't support the 'GPOS' table.
 * 
 */

const nameTableNames = [
	'copyright',
	'fontFamily',
	'fontSubfamily',
	'uniqueID',
	'fullName',
	'version',
	'postScriptName',
	'trademark',
	'manufacturer',
	'designer',
	'description',
	'manufacturerURL',
	'designerURL',
	'license',
	'licenseURL',
	'reserved',
	'typoFamily',
	'typoSubfamily',
	'compatibleFullName',
	'sampleText',
	'postScriptFindFontName',
	'wwsFamily',
	'wwsSubfamily'
];

// List of OpenType features that should have user control
// Based on http://tiro.com/John/Enabling_Typography_(OTL).pdf
export const userFeatures = {
	"smpl": "Simplified Forms",
	"trad": "Traditional Forms",
	"calt": "Contextual Alternates",
	"clig": "Contextual Ligatures",
	"jalt": "Justification Alternates",
	"liga": "Standard Ligatures",
	"rand": "Randomize",
	"afrc": "Alternative Fractions",
	"c2pc": "Petite Capitals From Capitals",
	"c2sc": "Small Capitals From Capitals",
	"case": "Case-Sensitive Forms",
	"cpsp": "Capital Spacing",
	"dlig": "Discretionary Ligatures",
	"dnom": "Denominators",
	"falt": "Final Glyph on Line Alternates",
	"frac": "Fractions",
	"halt": "Alternate Half Widths",
	"hist": "Historical Forms",
	"hwid": "Half Widths",
	"lnum": "Lining Figures",
	"mgrk": "Mathematical Greek",
	"nalt": "Alternate Annotation Forms",
	"numr": "Numerators",
	"onum": "Oldstyle Figures",
	"ordn": "Ordinals",
	"ornm": "Ornaments",
	"pcap": "Petite Capitals",
	"pnum": "Proportional Figures",
	"ruby": "Ruby Notation Forms",
	"salt": "Stylistic Alternates",
	"smcp": "Small Capitals",
	"ss01": "Stylistic Set 01",
	"ss02": "Stylistic Set 02",
	"ss03": "Stylistic Set 03",
	"ss04": "Stylistic Set 04",
	"ss05": "Stylistic Set 05",
	"ss06": "Stylistic Set 06",
	"ss07": "Stylistic Set 07",
	"ss08": "Stylistic Set 08",
	"ss09": "Stylistic Set 09",
	"ss10": "Stylistic Set 10",
	"ss11": "Stylistic Set 11",
	"ss12": "Stylistic Set 12",
	"ss13": "Stylistic Set 13",
	"ss14": "Stylistic Set 14",
	"ss15": "Stylistic Set 15",
	"ss16": "Stylistic Set 16",
	"ss17": "Stylistic Set 17",
	"ss18": "Stylistic Set 18",
	"ss19": "Stylistic Set 19",
	"ss20": "Stylistic Set 20",
	"subs": "Subscript",
	"sups": "Superscript",
	"swsh": "Swash",
	"titl": "Titling",
	"tnum": "Tabular Figures",
	"unic": "Unicase",
	"zero": "Slashed Zero",
	"lfbd": "Left Bounds",
	"rtbd": "Right Bounds",
	"kern": "Kerning"
};

// Accepts a font file as an ArrayBuffer and return an objects containing parts 
// of the 'name', 'OS/2' and 'GSUB' tables. 
// The selection of fields is very specific to the need of Stack & Justify
export function parse(buffer) {
	const font = {};
	const data = new DataView(buffer, 0);
	const signature = getTag(data, 0);
	let numTables = getUint16(data, 4);
	let tableEntries = parseOpenTypeTableEntries(data, numTables);

	for (let tableEntry of tableEntries) {
		switch (tableEntry.tag) {
			case 'name':
				font.name = parseNameTable(data, tableEntry.offset);
				break;
			case 'OS/2':
				font.OS2 = parseOS2Table(data, tableEntry.offset);
				break;
			case 'GSUB':
				font.GSUB = parseGSUBTable(data, tableEntry.offset);
				break;
		}
	}

	return font;
}

// Format the font tables into a FontInfo object to use in the UI
export function getFontInfo(font, fileName) {
	const info = {};

	info.weightClass = font.OS2.usWeightClass;
	info.widthClass = font.OS2.usWidthClass;
	info.isItalic = font.OS2.fsSelection.italic;

	// Get proper names
	info.familyName = font.name.typoFamily || font.name.fontFamily;
	info.subfamilyName = font.name.typoSubfamily || font.name.fontSubfamily;
	info.fullName = info.familyName + ' ' + info.subfamilyName;
	info.fileName = fileName;

	// Create feature list
	if (font.GSUB === undefined) return info;
	
	info.features = [];
	for (const feature of font.GSUB.featureList) {
		const featureInfo = {
			tag: feature.tag,
			name: undefined
		}
		const featureAlreadyExists = info.features.some((_feature) => _feature.tag === feature.tag);

		if (userFeatures[feature.tag] && !featureAlreadyExists) {
			// Check if a custom description exists for the feature (usually for ss01-20)
			if (feature.uiNameID !== undefined) {
				featureInfo.name = font.name[feature.uiNameID];
			} else {
				featureInfo.name = userFeatures[feature.tag];
			}
			info.features.push(featureInfo);
		}
	}

	return info;
}

function parseOpenTypeTableEntries(data, numTables) {
	const tableEntries = [];
	let p = 12;
	for (let i = 0; i < numTables; i+=1) {
		const tag = getTag(data, p);
		const offset = getUint32(data, p+8);
		const length = getUint32(data, p+12);
		tableEntries.push({tag, offset, length, compression: false});
		p += 16;
	}

	return tableEntries;
}

function parseNameTable(data, start) {
	const table = {};
	const p = Parser(data, start);
	const format = p.parseUint16();
	const recordsNum = p.parseUint16();
	const storageOffset = start + p.parseUint16();


	for (let i = 0; i < recordsNum; i++) {
		const platformID = p.parseUint16();
		const encodingID = p.parseUint16();
		const languageID = p.parseUint16();
		const nameID = p.parseUint16();
		const byteLength = p.parseUint16();
		const recordOffset = storageOffset + p.parseUint16();
		const name = nameTableNames[nameID] || nameID;

		if (platformID !== 3 || languageID !== 0x0409) continue;

		let text = getUTF16String(data, recordOffset, byteLength);
		table[name] = text;
	}

	return table;
}

function parseGSUBTable(data, start) {
	const table = {};
	const featureListOffset = start + getUint16(data, start + 6);
	const featureCount = getUint16(data, featureListOffset);
	const p = Parser(data, featureListOffset + 2);

	table.featureList = [];
	for (let i = 0; i < featureCount; i++) {
		const featureTag = p.parseTag();
		let uiNameID;

		// Some features can have custom descriptions
		// The uiNameID points to a string in the name table
		const featureOffset = featureListOffset + p.parseUint16();
		const featureParamsOffset = getUint16(data, featureOffset);
		if (featureParamsOffset !== 0) {
			uiNameID = getUint16(data, featureOffset + featureParamsOffset + 2);	
		}

		table.featureList.push({
			tag: featureTag,
			uiNameID
		});
	}

	return table;
}

function parseOS2Table(data, start) {
	const table = {};
	table.usWeightClass = getUint16(data, start + 4);
	table.usWidthClass = getUint16(data, start + 6);
	const fsSelectionRaw = getUint16(data, start + 62);
	table.fsSelection = parseFsSelection(fsSelectionRaw);

	return table;
}

function parseFsSelection(uint16) {
	const flags = {}
	const bits = uint16.toString(2).padStart(16, '0').split('').reverse().map(bit => bit === "0" ? false : true);
	flags.italic = bits[0];
	flags.underscore = bits[1];
	flags.negative = bits[2];
	flags.outlined = bits[3];
	flags.strikeout = bits[4];
	flags.bold = bits[5];
	flags.regular = bits[6];
	flags.useTypoMetrics = bits[7];
	flags.wws = bits[8];
	flags.oblique = bits[9];

	return flags;
} 

function Parser(data, offset) {
	let dOffset = 0;

	function parseUint16() {
		const val = getUint16(data, offset + dOffset);
		dOffset += 2;
		return val;
	}

	function parseInt16() {
		const val = getInt16(data, offset + dOffset);
		dOffset += 2;
		return val;
	}

	function parseTag() {
		const val = getTag(data, offset + dOffset);
		dOffset += 4;
		return val;
	}

	return {
		data,
		offset,
		get currentOffset() {
			return offset + dOffset;
		},
		parseUint16,
		parseInt16,
		parseTag
	}
}

function getUTF16String(data, offset, numBytes) {
	const codePoints = [];
	const numChars = numBytes/2;
	for (let i = 0; i < numChars; i++, offset += 2) {
		codePoints[i] = data.getUint16(offset);
	}

	return String.fromCharCode.apply(null, codePoints);
}

function getUint8(data, offset) {
	return data.getUint8(offset, false);
}

function getUint16(data, offset) {
	return data.getUint16(offset, false);
}

function getInt16(data, offset) {
	return data.getInt16(offset, false);
}

function getUint32(data, offset) {
	return data.getUint32(offset, false);
}

function getTag(data, offset) {
	let tag = '';
	for (let i = offset; i < offset + 4; i += 1) {
		tag += String.fromCharCode(data.getInt8(i));
	}
	return tag;
}

function getBytes(data, start, numBytes) {
	const bytes = [];
	for (let i = start; i < start + numBytes; i += 1) {
		bytes.push(data.getUint8(i));
	}

	return bytes;
}