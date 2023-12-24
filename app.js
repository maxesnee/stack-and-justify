import { Layout } from "./Layout.js";
import { Filters } from "./Filters.js";
import { Words } from "./Words.js";
import { Fonts } from "./Fonts.js";
import { Font } from "./Font.js";

const root = document.querySelector('#app');
const acceptedExtensions = /^.*\.(ttf|otf|woff|woff2)$/i;

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
			Fonts.add(Font(_fontName, _fontData));
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
				m('div.line-controls-left',
					m(SizeInput, {params: line}),
					Fonts.list.length ? m(FontSelect, {params: line}) : ''
				),
				line.font ?
				m('div', {class: 'text', style: {
					whiteSpace: "nowrap",
					fontSize: Layout.globalSize.locked ? Layout.globalSize.get() : line.size.get(),
					width: Layout.width.get(),
					fontFamily: Layout.globalFont.locked ? Layout.globalFont.font?.name : line.font.name
				}}, line.text) : '',
				m('div.line-controls-right',
					m(CaseSelect, {params: line}),
					m(CopyButton, {onclick: line.copyText}),
					m(UpdateButton, {onclick: line.update})
				)
			);
		}
	}
}

function Specimen(initialVnode) {
	Layout.addLine('60px');
	Layout.addLine('60px');


	return {
		view: function(vnode) {
			return m('div', {class: 'specimen'},
				m('header.specimen-header',
					m(FontItems),
					m('div.specimen-header-controls',
						m(WordsSelect),
						m(LineCount)
					)
				),
				m('div.specimen-controls',
					m('div.line-controls-left',
						m(SizeInputGlobal),
						Fonts.list.length ? m(FontSelectGlobal) : ''
					),
					m(WidthInput),
					m('div.line-controls-right',
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

function FontItems(initialVnode) {
	let scrollState = 'start';
	let scroll = false;

	function onscroll(e) {
		const scrollAmount = e.target.scrollWidth - e.target.offsetWidth;
		const scrollFromStart = e.target.scrollLeft;
		const scrollFromEnd = scrollAmount - e.target.scrollLeft;

		if (0 <= scrollFromStart && scrollFromStart < scrollAmount * 0.1) {
			scrollState = 'start';
		} else if (0 <= scrollFromEnd && scrollFromEnd < scrollAmount * 0.1) {
			scrollState = 'end';
		} else {
			scrollState = 'middle';
		}
	}

	function scrollToStart() {
		const scroller = document.querySelector('.font-items-scroller');
		scroller.scrollTo(0, 0);
	}

	function scrollToEnd() {
		const scroller = document.querySelector('.font-items-scroller');
		scroller.scrollTo(scroller.scrollWidth, 0);
	}

	return {
		oncreate: function(vnode) {
			const scrollObserver = new MutationObserver(() => {
				m.redraw();
			}).observe(vnode.dom.querySelector('.font-items-scroller'), {childList: true});
		},
		view: function(vnode) {
			scroll = (() => {
				const scroller = document.querySelector('.font-items-scroller');
				if (!scroller) return false;
				return scroller.scrollWidth > scroller.offsetWidth;
			})();
			return m('div.font-items',
				scroll && scrollState !== 'start' ? m('button.scroll-left-button', {onclick: scrollToStart}, '◁') : '',
				scroll && scrollState !== 'start' ? m('div.scroll-left-overlay') : '',
				m('div.font-items-scroller', {onscroll},
					Fonts.list.map(font => {
						return m(FontItem, {font})
					})
				),
				scroll && scrollState !== 'end' ? m('div.scroll-right-overlay') : '',
				scroll && scrollState !== 'end' ? m('button.scroll-right-button', {onclick: scrollToEnd}, '▷') : '',
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

function FontSelect(initialVnode) {
	return {
		onupdate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			// 15 is the size of the arrow
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth + 15;
			vnode.dom.querySelector('select.font-select').style.width = width + 'px';
		},
		view: function(vnode) {
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', left: '-100%'}}, vnode.attrs.params.font?.name),
				m('select.font-select', {
					oninput: (e) => {vnode.attrs.params.fontId = e.target.options[e.target.selectedIndex].value },
					disabled: Layout.globalFont.locked
				},
				Fonts.list.map((font) => {
					return m('option', { value: font.id, selected: vnode.attrs.params.fontId == font.id}, font.name)
				}))
			)
		}
	}
}

function FontSelectGlobal(initialVnode) {
	return {
		onupdate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			// 15 is the size of the arrows
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth + 15;
			vnode.dom.querySelector('select.font-select').style.width = width + 'px';
		},
		view: function(vnode) {
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', left: '-100%'}}, Layout.globalFont.font?.name),
				m('select.font-select', {
					oninput: (e) => {Layout.globalFont.id = e.target.options[e.target.selectedIndex].value},
					disabled: !Layout.globalFont.locked
				},
					Fonts.list.map((font) => {
						return m('option', { value: font.id, selected: Layout.globalFont.id == font.id}, font.name)
					})
				),
				m('button.font-select-lock', {
					onclick: () => {Layout.globalFont.locked = !Layout.globalFont.locked}
				}, Layout.globalFont.locked ? '🔒' : '🔓'),
			)
		}
	}
}


function FontItem(initialVnode) {
	return {
		view: function(vnode) {
			return m('div', {class: `font-item ${vnode.attrs.font.isLoading ? 'loading' : ''}`},
				m('span', {class: 'font-item-label'}, vnode.attrs.font.name),
				vnode.attrs.font.isLoading ? 
					m(IconSpinning) : 
					m('button.font-item-remove', {onclick: () => { Fonts.remove(vnode.attrs.font); }}, '❌'),
			)
		}
	}
}

function IconSpinning(initialVnode) {
	return {
		view: function(vnode) {
			return m('svg.icon-spinning', {xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 1357 1358', width: 9.5, height: 9.5, fill:'currentColor'},
					m('path', {d: 'M677 215c60 0 109-49 109-107C786 48 737 0 677 0c-58 0-109 49-107 108 2 58 49 107 107 107Zm-403 976c60 0 109-50 107-107-2-61-47-107-107-107-58 0-107 48-107 107 0 58 49 107 107 107ZM107 786c59 0 108-47 108-107 0-58-49-107-108-107C47 572 0 621 0 679c0 60 47 107 107 107Zm572 572c58 0 107-49 107-108 0-58-49-107-107-107-60 0-107 49-107 107 0 59 48 108 107 108ZM274 382c57 0 107-47 107-107 0-59-47-108-107-107-59 1-108 48-107 107s49 107 107 107Zm809 808c57 0 107-43 107-107 0-60-48-107-107-107-61 0-107 47-107 107s46 107 107 107Zm167-404c59 0 107-48 107-107v-1c0-59-48-110-107-108-60 2-107 49-107 109 0 59 49 107 107 107Zm-168-404c60 0 107-47 107-107 0-61-47-106-107-107-59-1-107 46-107 107 0 59 49 107 107 107Z'})
				)
		}
	}
}

function WordsSelect(initialVnode) {
	let open = false;

	document.onclick = (e) => {
		const menu = document.querySelector('.lang-select-menu');
		const btn = document.querySelector('.lang-select-button');
		
		if (!menu.contains(e.target) && e.target !== btn && open) {
			open = false;
			m.redraw();
		}
	}

	async function update(e) {
		e.preventDefault();
		const form = document.querySelector('.lang-select-menu');
		const formData = new FormData(form);
		const selectedLanguages = formData.getAll('languages');
		const selectedSources = formData.getAll('sources');

		for (const language of Words.data.languages) {
			if (selectedLanguages.includes(language.name)) {
				language.selected = true
			} else {
				language.selected = false;
			}
		}

		for (const source of Words.data.sources) {
			if (selectedSources.includes(source.name)) {
				source.selected = true
			} else {
				source.selected = false;
			}
		}

		await Fonts.update();
		Layout.lines.forEach(line => line.update());

	}

	return {
		view: function(vnode) {
			return m('div.lang-select', 
				m('button.lang-select-button', {onclick: () => { open = !open }}, "Words ▿"),
				m('form.lang-select-menu', {style: {visibility: open ? 'visible' : 'hidden'}}, 
					m('fieldset',
						m('legend', 'Languages'),
						Words.data.languages.map(lang => {
							return m('div.checkbox', 
								m('input', {name: 'languages', type: 'checkbox', id:lang.name, value: lang.name, checked: lang.selected}),
								m('label', {for: lang.name}, lang.label)
							)
						})
					),
					m('fieldset', 
						m('legend', 'Sources'),
						Words.data.sources.map(source => {
							return m('div.checkbox',
								m('input', {name: 'sources', type: 'checkbox', id:source.name, value: source.name, checked: source.selected}),
								m('label', {for: source.name}, source.label)
							)
						})
					),
					m('div.lang-select-update', 
						m('button', {onclick: update},'↻ Update')
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

m.mount(root, App);