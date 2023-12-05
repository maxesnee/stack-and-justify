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

		text = getWord(size, layout.lineWidth);
		textBlock.textContent = text;
		textBlock.style.fontSize = size + "px"; 
		textBlock.style.width = layout.lineWidth + "px";
		textBlock.style.fontWeight = fontWeight;
		textBlock.style.fontFamily = font.name;
	}

	// update();

	el.update = update;

	return el;
}

function CaseControls() {

	const capRadio = $("div", 
			$("input", {type: "radio", id: "capitalised", name: "case", oninput: update, checked: true}),
			$("label", {for: "capitalised"}, "Capitalised")
		);
	const uppRadio = $("div", 
		$("input", {type: "radio", id: "uppercase", name: "case", oninput: update}),
		$("label", {for: "uppercase"}, "UPPERCASE")
	);
	const lcRadio = $("div", 
		$("input", {type: "radio", id: "lowercase", name: "case", oninput: update}),
		$("label", {for: "lowercase"}, "lowercase")
	);

	const el = $("fieldset.case-controls",
		lcRadio,
		capRadio,
		uppRadio
		);

	function update() {
		let active = [capRadio, uppRadio, lcRadio].filter(radio => radio.firstChild.checked)[0].firstChild;
		filter = active.id;

		if (font) {
			sortedDict = sortDict(dictionary.languages.ukacd.words);	
		}

		if (el.oninput !== null) {
			el.oninput();	
		}
	}

	// update();

	return el;
}

function SizeSlider(lineWidth = layout.lineWidth) {
	const sizeLabel = $("label", {for: "line-width"});
	const sizeInput = $("input", {name: "line-width", type: "range", min: 50, max: 1000, value: lineWidth, oninput: update});

	const el = $("div.size-slider", 
		sizeLabel,
		sizeInput
		);

	function update(e) {
		lineWidth = sizeInput.value;
		sizeLabel.textContent = lineWidth;

		if (el.oninput !== null) {
			el.oninput();	
		}
		
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
	const el = $('div.font-item', {});

	if (font) el.textContent = font.name;

	function update() {
		el.textContent = font.name;
	}

	el.update = update;

	return el;
};

function fontForm() {
	if (localStorage['fontData']) {
		font = {
			name: localStorage['fontName'],
			data: localStorage['fontData']
		}
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

	const fontItem = FontItem();

	function update() {
		const fontFaceRule = `@font-face { font-family: ${font.name}; src: url('${font.data}') }`;
		document.styleSheets[0].insertRule(fontFaceRule, 0);
		sortedDict = sortDict(dictionary.languages.ukacd.words);
		Specimen.update();
		fontItem.update();
	}

	const el = 
	$("form",
		fontItem,
		$("div.drop-zone", {ondrop: handleDrop, ondragover: handleDragOver},
				"Drop font files here"
		)
	);

	update();

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

	const caseControls = CaseControls();
	caseControls.oninput = update;

	const lines = List($("div.lines"), sizes, Line);

	const el =  
	$("div.specimen",
		slider,
		caseControls,
		lines,
		$("div.line.add-line", 
			$("button", {onclick: addLine}, "+")
		)
	);

	function addLine() {
		// lines.append(Line(36, layout));
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