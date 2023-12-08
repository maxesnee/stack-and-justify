import { Layout } from "./Layout.js";
import { Filters } from "./Filters.js";
import { WordEngine } from "./WordEngine.js";

const root = document.querySelector('#app');
const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;
let font = null;

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
	function onchange(e) {
		Filters.select(e.currentTarget.selectedIndex);
		Layout.lines.forEach(line => line.update());
	}

	return {
		view: function(vnode) {
			return m("select", {class: 'case-select', name: 'case', onchange},
				Filters.list.map((filter, i) => {
					return m("option", {value: filter.value, selected: Filters.selected == filter.value}, filter.label)
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
					m('input', {
						type: 'number', 
						name: 'line-size', 
						value: vnode.attrs.line.size,
						oninput: (e) => {vnode.attrs.line.size = e.currentTarget.value}, 
						style: {userSelect: "none"}
					}),
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
		WordEngine.setFont(font);
		WordEngine.sort();
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