import { Layout } from "./Layout.js";
import { Filters } from "./Filters.js";
import { WordEngine } from "./WordEngine.js";
import { Dictionary } from "./Dictionary.js";


const root = document.querySelector('#app');
const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;
let font = null;

if (localStorage['fontData']) {
	font = {
		name: localStorage['fontName'],
		data: localStorage['fontData']
	}
	updateFont();
}

function removeFont() {
	font = null;
	localStorage.clear();
	Layout.lines.forEach(line => line.update());
}

function updateFont() {
	const fontFaceRule = `@font-face { font-family: ${font.name}; src: url('${font.data}') }`;
	document.styleSheets[0].insertRule(fontFaceRule, 0);
	WordEngine.setFont(font);
	WordEngine.sort().then(() => {
		Layout.lines.forEach(line => line.update());	
	});
}

const App = {
	view: function(vnode) {
		return [
			m(Header),
			m(Specimen)
		]
	}
}

function Header(initialVnode) {
	return {
		view: function(vnode) {
			return m('header.header',
				m(FontUploader),
				m('h1.logo', "Stack and Justify"),
				m('span', "Drop a font here ↓"),
				m('div.header-btns',
					m(DarkModeButton),
					m('button.about-btn', "❓"),
				)
			)
		}
	}
}

function FontUploader(initialVnode) {

	function ondragover(e) {
		e.preventDefault();
	}

	function ondrop(e) {
		e.preventDefault();

		let files = e.dataTransfer.files;
		handleFile(files[0], function(_fontName, _fontData) {
			if (font === null) { font = { name: '', data: '' }};

			font.name = _fontName;
			font.data = _fontData;

			localStorage['fontName'] = font.name;
			localStorage['fontData'] = font.data;

			updateFont();
		});
	}

	return {
		view: function(vnode) {
			return m('div.drop-zone', {ondrop, ondragover})
		}
	}
}

function DarkModeButton(initialVnode) {
	return {
		view: function(vnode) {
			return m('button.dark-mode-btn', {
				onclick: () => { document.body.classList.toggle('dark') }
			}, "◒")
		}
	}
}


function Line(initialVnode) {
	return {
		view: function(vnode) {
			let line = vnode.attrs.line;
			return m('div', {class: 'specimen-line'},
				m(SizeInput, {params: line}),
				font ?
				m('div', {class: 'text', style: {
					whiteSpace: "nowrap",
					fontSize: Layout.globalSize.locked ? Layout.globalSize.get() : line.size.get(),
					width: Layout.width.get(),
					fontFamily: font.name
				}}, line.text) : '',
				m('div.line-controls',
					m(CaseSelect, {params: line}),
					m(CopyButton, {onclick: line.copyText}),
					m(UpdateButton, {onclick: line.update})
				)
			);
		}
	}
}

function Specimen(initialVnode) {
	return {
		view: function(vnode) {
			return m('div', {class: 'specimen'},
				m('header.specimen-header',
					font ? m(FontItem) : '',
					m('div.specimen-header-controls',
						m(LanguageSelect),
						m(LineCount)
					)
				),
				m('div.specimen-controls',
					m(SizeInputGlobal),
					m(WidthInput),
					m('div.line-controls',
						m(CaseSelectGlobal),
						m(CopyButton, {onclick: Layout.copyText}),
						m(UpdateButton, {onclick: Layout.update})
					)
				),
				m('div.specimen-lines', 
					Layout.lines.map((line) => m(Line, {line}))
				)
			)
		}
	}
}

function SizeInput(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.size-input',
				m('button', {
					onclick: () => { vnode.attrs.params.size.decrement() },
					disabled: Layout.globalSize.locked
				}, '－'),
				m('input', {
					type: 'text', 
					value: vnode.attrs.params.size.get(), 
					onchange: (e) => {vnode.attrs.params.size.set(e.currentTarget.value)},
					disabled: Layout.globalSize.locked
				}),
				m('button', {
					onclick: () => { vnode.attrs.params.size.increment() },
					disabled: Layout.globalSize.locked
				}, '＋')
			)
		}
	}
}

function SizeInputGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.size-input.size-input-global',
				m('button', { 
					onclick: () => { Layout.globalSize.decrement() },
					disabled: !Layout.globalSize.locked
				}, '－'),
				m('input', {
					type: 'text', 
					value: Layout.globalSize.get(),
					onchange: (e) => {Layout.globalSize.set(e.currentTarget.value)},
					disabled: !Layout.globalSize.locked
				}),
				m('button', {
					onclick: () => { Layout.globalSize.increment() },
					disabled: !Layout.globalSize.locked
				}, '＋'),
				m('button.size-input-lock', {
					onclick: () => {Layout.globalSize.locked = !Layout.globalSize.locked}
				}, `${Layout.globalSize.locked ? '🔒' : '🔓'}`)
			)
		}
	}
}

function WidthInput(initialVnode) {
	let isDragging = false;
	let startFromRight = null;
	let startWidth = Layout.width.getIn('px');
	let startX = 0;
	let dX = 0;

	document.body.onmousemove = onmousemove;
	document.body.onmouseup = onmouseup;

	function onmousedown(e) {
		startFromRight = e.currentTarget.classList.contains('right');
		isDragging = true;
		startX = e.clientX;
		startWidth = Layout.width.getIn('px');
	}

	function onmousemove(e) {
		if (isDragging) {
			dX = e.clientX - startX;

			// Invert delta if dragging started from left side
			dX = startFromRight ? dX : -dX;

			// Width is distributed on both side, so this allow 
			// the resizing to be in sync with cursor visually
			dX = dX*2;

			// Prevent from getting negative width
			dX = dX > -startWidth ? dX : -startWidth;


			Layout.width.setIn('px', startWidth + dX);
			m.redraw();
		}
	}

	function onmouseup(e) {
		isDragging = false;
	}

	return {
		view: function(vnode) {
			return m('div.width-input', {style: { width: Layout.width.get()}}, 
				m('div.width-input-handle.left', {onmousedown}),
				m('span.width-input-line'),
				m('input', {type: 'text', value: Layout.width.get(), onchange: (e) => {Layout.width.set(e.currentTarget.value)}}),
				m('span.width-input-line'),
				m('div.width-input-handle.right', {onmousedown})
			)
		}
	}
}

function UpdateButton(initialVnode) {

	return {
		view: function(vnode) {
			return m('button.update-button', {onclick: vnode.attrs.onclick },'↻')
		}
	}
}

function CopyButton(initialVnode) {
	return {
		view: function(vnode) {
			return m('button.copy-button', {onclick: vnode.attrs.onclick}, '📋')
		}
	}
}

function CaseSelect(initialVnode) {
	return {
		view: function(vnode) {
			return m('select.case-select', {
					onchange: (e) => {vnode.attrs.params.filter = e.currentTarget.selectedIndex},
					disabled: Layout.globalFilter.locked
				},
				m('option', {value: 'lowercase', selected: vnode.attrs.params.filter == 0}, 'Lowercase'),
				m('option', {value: 'uppercase', selected: vnode.attrs.params.filter == 1}, 'Uppercase'),
				m('option', {value: 'capitalised', selected: vnode.attrs.params.filter == 2}, 'Capitalised')
			)
		}
	}
}
	
function CaseSelectGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.case-select', 
				m('button.case-select-lock', {
					onclick: () => {Layout.globalFilter.locked = !Layout.globalFilter.locked}
				}, Layout.globalFilter.locked ? '🔒' : '🔓'),
				m('select.case-select', {
					onchange: (e) => {Layout.globalFilter.filter = e.currentTarget.selectedIndex},
					disabled: !Layout.globalFilter.locked
				},
					m('option', {value: 'lowercase', selected: Layout.globalFilter.filter == 0}, 'Lowercase'),
					m('option', {value: 'uppercase', selected: Layout.globalFilter.filter == 1}, 'Uppercase'),
					m('option', {value: 'capitalised', selected: Layout.globalFilter.filter == 2}, 'Capitalised')
				)
			)
		}
	}
}

function FontItem(initialVnode) {
	return {
		view: function(vnode) {
			return m('div', {class: 'font-item'},
				m('span', {class: 'font-item-label'}, font.name),
				m('button', {class: 'font-item-remove', onclick: removeFont}, '❌')
			)
		}
	}
}

function LanguageSelect(initialVnode) {

	async function oninput(e) {
		Dictionary.data[e.currentTarget.name].find(lang => lang.name == e.currentTarget.value).selected = e.currentTarget.checked;
		await WordEngine.sort();
		Layout.lines.forEach(line => line.update());
	}

	return {
		view: function(vnode) {
			return m('div.lang-select', 
				m('button.lang-select-button', "Words ▿"),
				m('form.lang-select-menu', 
					m('fieldset',
						m('legend', 'Languages'),
						Dictionary.data.languages.map(lang => {
							return m('div.checkbox', 
								m('input', {oninput, name: 'languages', type: 'checkbox', id:lang.name, value: lang.name, checked: lang.selected}),
								m('label', {for: lang.name}, lang.label)
							)
						})
					),
					m('fieldset', 
						m('legend', 'Sources'),
						Dictionary.data.sources.map(source => {
							return m('div.checkbox',
								m('input', {oninput, name: 'sources', type: 'checkbox', id:source.name, value: source.name, checked: source.selected}),
								m('label', {for: source.name}, source.label)
							)
						})
					)
				)
			)
		}
	}
}

function LineCount(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.line-count',
				m('label.line-count-label', {for: 'line-count'}, 'Lines'),
				m('button', {onclick: Layout.removeLine}, '－'),
				m('input.line-count-input', {type: 'number', id: 'line-count', value: Layout.lines.length, min: 1, max: 99, onchange: (e) => Layout.setLineCount(e.currentTarget.value)}),
				m('button', {onclick: Layout.addLine}, '＋')
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
		callback(fileName, data);
	}

	reader.readAsDataURL(file);
}

m.mount(root, App);