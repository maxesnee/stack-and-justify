const root = document.querySelector('#app');
const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;
let sortedDict = null;
let font = null;

const Filters = (function() {
	let selected = 2;

	const list = [
		{ value: 'lowercase', label: 'Lowercase'},
		{ value: 'uppercase', label: 'Uppercase'},
		{ value: 'capitalised', label: 'Capitalised'}
	];

	function select(i) {
		selected = i;
		sortedDict = sortDict(dictionary.languages.ukacd.words);
		Layout.lines.forEach(line => line.update());
	}

	return {
		list,
		get selected() {
			return selected
		},
		select
	}
})();

const Layout = (function() {
	let width = 600;
	let lines = [
		Line(60),
		Line(60)
	];

	function Line(size) {
		let text = getWord(size, width);

		function update() {
			text = getWord(size, width);
		}
		return {
			get size() {
				return size;
			},
			set size(value) {
				size = value;
				update();
			},
			update,
			get text() {
				return text;
			}
		}
	}

	function addLine() {
		lines.push(Line(60));
	}

	return {
		get width() {
				return width;
		},
		set width(value) {
			width = value;
			lines.forEach(line => line.update());
		},
		lines,
		addLine
	}
})();


const App = {
	view: function(vnode) {
		return [
			m(FontForm),
			m(Specimen)
		]
	}
}

function SizeSlider(initialVnode) {

	return {
		view: function(vnode) {
			return m('div.size-slider', 
				m("input", {type: "number", name: "line-width-label", value: Layout.width, oninput: (e) => {Layout.width = e.currentTarget.value}}),
				m("input", {name: "line-width", type: "range", min: 50, max: 1000, value: Layout.width, oninput: (e) => {Layout.width = e.currentTarget.value}})
			)
		}
	}
}

function CaseSelect(initialVnode) {
	return {
		view: function(vnode) {
			return m("select", {class: 'case-select', name: 'case', onchange: (e) => Filters.select(e.currentTarget.selectedIndex)},
				Filters.list.map((filter, i) => {
					return m("option", {value: filter.value, selected: Filters.selected == i}, filter.label)
				})
			)
		}
	}
}

function Line(initialVnode) {
	return {
		view: function(vnode) {
			return m('div', {class: 'line'},
				m('div', {class: 'size-select'}, 
					m('button', {onclick: () => vnode.attrs.line.size -= 1}, "◀︎"),
					m('span', {style: {userSelect: "none"}}, vnode.attrs.line.size),
					m('button', {onclick: () => vnode.attrs.line.size += 1}, "▶︎")
				),
				font ?
				m('div', {class: 'text', style: {
					whiteSpace: "nowrap",
					fontSize: vnode.attrs.line.size + 'px',
					width: Layout.width + 'px',
					fontFamily: font.name
				}}, vnode.attrs.line.text) : '',
				m("div", {class: "refresh"},
					m("button", {onclick: vnode.attrs.line.update}, '↩︎')
				)
			);
		}
	}
}

function Specimen(initialVnode) {
	return {
		view: function(vnode) {
			return m('div', {class: 'specimen'},
				m('div', {class: 'controls'},
					m(SizeSlider),
					m(CaseSelect)
				),
				font ?
					Layout.lines.map((line, i) => m(Line, {key: i, line: line})) : '',
				m('div', {class: 'line add-line'},
					m('button', {onclick: Layout.addLine}, "+")
				)
			)
		}
	}
}

function FontForm(initialVnode) {

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
		Layout.lines.forEach(line => line.update());
	}

	function remove(e) {
		e.preventDefault();

		font = null;
		localStorage.clear();
		Layout.lines.forEach(line => line.update());
	}

	return {
		view: function(vnode) {
			return m("form", {class: 'form'},
				font ?
				m('div', {class: 'font-item'},
					m('span', {class: 'font-item-label'}, font.name),
					m('button', {class: 'font-item-remove', onclick: remove}, 'x')
				) : '',
				m('div', {class: 'drop-zone', ondrop: handleDrop, ondragover: handleDragOver},
					"Drop font files here"
				)
			)
		}
	}
}

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

	switch (Filters.list[Filters.selected].value) {
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

m.mount(root, App);