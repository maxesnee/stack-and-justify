const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('#app');
let sortedDict = null;
let filter = 'capitalised';
const fontWeight = 300;
const layout = {
	lineWidth: 606
}
let font = null;
const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

function sortDict(dict) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	ctx.font = `100px ${font.name}`;
	const sorted = {};

	for (word of dict) {
		let filteredWord = applyFilter(word);
		let width = Math.floor(ctx.measureText(filteredWord).width);
		if (sorted[width] === undefined) {
			sorted[width] = []
		}
		sorted[width].push(filteredWord)
	}
	return sorted;
}

function getWord(size, width) {
	let tolerance = 5;
	let words = [];
	let scaledWidth = Math.round(width * (100 / size));

	for (let i = scaledWidth - tolerance; i <= scaledWidth + tolerance; i++) {
		if (sortedDict !== null && sortedDict[i] !== undefined) {
			words.push(...sortedDict[i]);	
		}
	}

	let randomIndex = Math.floor(Math.random()*words.length);
	return words[randomIndex] ?? "";
}

function applyFilter(string) {
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

const UID = (function() {
	let lastId = -1;

	function newId() {
		lastId += 1;
		return lastId;
	}

	return function() {
		return newId();
	}
})();


function Line(size) {
	let text = "";
	const sizeLabel = $('span', {style: {userSelect: "none"}});
	const textBlock = $('div.text', {style: {whiteSpace: "nowrap"}});

	const el = $("div.line",
		$("div.size-select",
			$("button", {onclick: decrementSize }, "◀︎"),
			sizeLabel,
			$("button", {onclick: incrementSize}, "▶︎")
			),
		textBlock,
		$("div", {class: "refresh"},
			$("button", {onclick: update}, '↩︎')
			)
		);

	function decrementSize() {
		size--;
		update();
	}

	function incrementSize() {
		size++;
		update();
	}

	function update() {
		sizeLabel.textContent = size;

		if (font) {
			text = getWord(size, layout.lineWidth);
			textBlock.textContent = text;
			textBlock.style.fontSize = size + "px"; 
			textBlock.style.width = layout.lineWidth + "px";
			textBlock.style.fontWeight = fontWeight;
			textBlock.style.fontFamily = font.name;
		}
	}

	update();

	el.update = update;

	return el;
}

// function CaseSelect() {
// 	const el = $("select.case-select", {name: 'case'},
// 			$("option", {value: 'lowercase'}, "Lowercase"),
// 			$("option", {value: 'uppercase'}, "Uppercase"),
// 			$("option", {value: 'capitalised', selected: 'selected'}, "Capitalised"),
// 		);

// 	function update() {
// 		if (font) {
// 			sortedDict = sortDict(dictionary.languages.ukacd.words);	
// 		}

// 		if (el.onchange !== null) {
// 			el.onchange();
// 		}
// 	}

// 	update();

// 	return el;
// }

function SizeSlider(lineWidth = layout.lineWidth) {
	const sizeLabel = $("input", {type: "number", name: "line-width-label", value: lineWidth, oninput: labelInput});
	const sizeInput = $("input", {name: "line-width", type: "range", min: 50, max: 1000, value: lineWidth, oninput: rangeInput});

	const el = $("div.size-slider", 
		sizeLabel,
		sizeInput
		);

	function update(e) {
		sizeInput.value = lineWidth;
		sizeLabel.value = lineWidth;

		if (el.oninput !== null) {
			el.oninput();	
		}
	}

	function labelInput() {
		lineWidth = sizeLabel.value;
		update();
	}

	function rangeInput() {
		lineWidth = sizeInput.value;
		update();
	}

	update();

	Object.defineProperty(el, "value", {
		get: () => {
			return lineWidth
		}
	});

	return el;
}

function FontItem() {
	const label = $('span.font-item-label');
	const el = $('div.font-item',
		label,
		$('button.font-item-remove', {onclick: remove}, 'x')
	);

	if (font) label.textContent = font.name;

	function update() {
		label.textContent = font.name;
	}

	function remove(e) {
		e.preventDefault();

		font = null;
		localStorage.clear();
		Specimen.update();
	}

	el.update = update;

	return el;
};

function fontForm() {
	const fontItem = FontItem();

	if (localStorage['fontData']) {
		font = {
			name: localStorage['fontName'],
			data: localStorage['fontData']
		}
		update();
	}

	function handleDragOver(e) {
		e.preventDefault();
	}

	function handleDrop(e) {
		e.preventDefault();

		let files = e.dataTransfer.files;
		handleFile(files[0], function(_fontName, _fontData) {
			// e.target.innerText = files[0].name;
			if (font === null) { font = { name: '', data: '' }};

			font.name = _fontName;
			font.data = _fontData;

			update();
		});
	}

	function update() {
		const fontFaceRule = `@font-face { font-family: ${font.name}; src: url('${font.data}') }`;
		document.styleSheets[0].insertRule(fontFaceRule, 0);
		sortedDict = sortDict(dictionary.languages.ukacd.words);
		Specimen.update();
		fontItem.update();
	}

	const el = 
	$("form.form",
		fontItem,
		$("div.drop-zone", {ondrop: handleDrop, ondragover: handleDragOver},
				"Drop font files here"
		)
	);

	return el;
}

function handleFile(file, callback) {
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
		localStorage['fontName'] = fileName;
		localStorage['fontData'] = data;
		callback(fileName, data);
	}

	reader.readAsDataURL(file);
}



const Specimen = (function() {
	// const sizes = [100, 92, 84, 76, 58, 50, 42, 34, 30, 26, 22];
	const sizes = [60, 60, 60, 60, 60, 60, 60];

	const slider = SizeSlider();
	slider.oninput = update;

	const caseSelect = $("select.case-select", {name: 'case'},
			$("option", {value: 'lowercase'}, "Lowercase"),
			$("option", {value: 'uppercase'}, "Uppercase"),
			$("option", {value: 'capitalised', selected: 'selected'}, "Capitalised"),
		);
	caseSelect.onchange = function() {
		filter = caseSelect.options[caseSelect.selectedIndex].value;

		if (font) {
			sortedDict = sortDict(dictionary.languages.ukacd.words);
			update();
		}
	};

	const lines = List($("div.lines"), sizes, Line);

	const el =  
	$("div.specimen",
		$('div.controls',
			slider,
			caseSelect
		),
		lines,
		$("div.line.add-line", 
			$("button", {onclick: addLine}, "+")
		)
	);

	function addLine() {
		lines.add(Line(36, layout), UID());
	}

	function update() {
		layout.lineWidth = slider.value;
		lines.update();	
	}

	el.update = update;
	return el;
})();

container.append(fontForm(), Specimen);