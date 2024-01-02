import { Layout } from "./Layout.js";
import { Filters } from "./Filters.js";
import { Words } from "./Words.js";
import { Fonts } from "./Fonts.js";
import { Font } from "./Font.js";

const root = document.querySelector('#app');
let showAbout = false;

function handleFile(file, callback) {
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

const App = {
	view: function(vnode) {
		return [
			m(Header),
			m(DropZone),
			m('main.main',			
				Fonts.list.length ? m(Specimen) : m(SplashScreen),
				m(About)
			),
			m(Footer)
		]
	}
}

function Header(initialVnode) {
	return {
		view: function(vnode) {
			return m('header.header',
				m('h1.logo',
					m(SVG, {src: 'svg/logo02.svg'}), 
					m('span', 'Stack and Justify')
					),
				m(FontInput),
				m('div.header-btns',
					m(DarkModeButton),
					m('button.about-btn', {onclick: () => showAbout = !showAbout }, "❓"),
					)
				)
		}
	}
}

function About(initialVnode) {
	return {
		view: function(vnode) {
			return m('section.about', {class: showAbout ? 'open' : ''},
				m(SVGAnimation, {src: 'svg/stack-and-justify-animation.svg', frames: 75}),
				m('div.about-text', 
					m('p.t-big', 
						m('em.bold', "Stack & Justify"),
						m('span', " is a tool to help create type specimens by finding words or phrases of the same width. Published by Max Esnée and free to use.")
					),
					m('p.t-big', "Your fonts are not uploaded, they remain stored locally in your browser."),
					m('p.t-big', 
						m('span', "For a similar tool, also check "),
						m('a.big-link', {target: '_blank', href: "https://workshop.mass-driver.com/waterfall"}, "Mass Driver’s Waterfall"),
						m('span', " from which this tool was inspired.")
					)
				),
			)
		}
	}
}

function FontInput(initialVnode) {
	return {
		oncreate: function(vnode) {
			const input = vnode.dom.querySelector('input[type="file"');
			vnode.dom.querySelector('a').addEventListener('click', (e) => {
				e.preventDefault();
				input.click();
			});

			input.addEventListener('change', (e) => {
				let files = input.files;
				
				Array.from(files).forEach(file => {
					handleFile(file, function(fontName, fontData) {
						Fonts.add(Font(fontName, fontData));
					});
				});
			});
		},
		view: function(vnode) {
			return m('form.drop-message',
				m('input', {type: 'file', id:'uploader', multiple:'multiple', accept: 'font/otf, font/ttf, font/woff, font/woff2, .otf, .ttf, .woff, .woff2', style:{display: 'none'}}),
				m('span', 'Drop your fonts anywhere or '),
				m('label', {for: 'file-upload'}, 
					m('a', 'browse your computer ↗')
				)
			)
		}
	}
}

function SVG(initialVnode) {
	return {
		oninit: function(vnode) {
			fetch(vnode.attrs.src)
			.then(response => response.text())
			.then(svgStr =>{
				const parser = new DOMParser();
				const svg = parser.parseFromString(svgStr, 'image/svg+xml').childNodes[0];
				vnode.dom.replaceWith(svg);
			})

		},
		view: function(vnode) {
			return m('div.svg');
		}
	}
}

function DropZone(initialVnode) {
	return {
		oncreate: function(vnode) {
			let  lastTarget = null;

			window.addEventListener('dragover', function(e) {
				e.preventDefault();
				e.dataTransfer.dropEffect = "copy";
			});

			window.addEventListener('dragenter', function(e) {
				lastTarget = e.target;
				e.dataTransfer.effectAllowed = "copy";

				
				vnode.dom.classList.add('active');
			});

			window.addEventListener('dragleave', function(e) {
				if(e.target === lastTarget || e.target === document) {
					vnode.dom.classList.remove('active');	
				}
			});

			vnode.dom.addEventListener('drop', function(e) {
				e.preventDefault();

				let files = e.dataTransfer.files;
				
				Array.from(files).forEach(file => {
					handleFile(file, function(fontName, fontData) {
						Fonts.add(Font(fontName, fontData));
					});
				});
				vnode.dom.classList.remove('active');
			});
		},
		view: function(vnode) {
			return m('div.drop-zone')
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

function SplashScreen(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.splash-screen',
				m('div.splash-screen-text',
					m(SVGAnimation, {src: 'svg/font-files-animation.svg', frames: 18}),
					m('p.t-big', 'To start, drop one or more font files anywhere on the window.'),
					m('p.splash-screen-notice', 'You fonts aren’t uploaded, they stay cached locally in your browser only.')
				)
			)
		}
	}
}

function SVGAnimation(initialVnode) {
	function animate(svg, frames) {
		const fps = 12;
		let start;
		let lastFrameCount = 0;
		requestAnimationFrame(step);

		function step(timestamp) {
			if (start === undefined) start = timestamp;
			const elapsed = timestamp - start;
			const frameCount = Math.floor(elapsed / (1000/fps))%frames;
			if (frameCount !== lastFrameCount) {
				svg.children[lastFrameCount].setAttribute('display', 'none');
				svg.children[frameCount].setAttribute('display', 'block');
			}

			lastFrameCount = frameCount;
			requestAnimationFrame(step);
		}
	}

	return {
		oninit: function(vnode) {
			fetch(vnode.attrs.src)
			.then(response => response.text())
			.then(svgStr => {
				const parser = new DOMParser();
				const svg = parser.parseFromString(svgStr, 'image/svg+xml').childNodes[0];
				vnode.dom.replaceWith(svg);
				animate(svg, vnode.attrs.frames);
			})
		},
		view: function(vnode) {
			return m('div.svg-animation');
		}
	}
}

function Footer(initialVnode) {
	return {
		view: function(vnode) {
			return m('footer.footer',
				m('div.credit',
					m('span', 'Created by '),
					m('a', 'Max Esnée ↗')
				)
			)
		}
	}
}


function Line(initialVnode) {
	return {
		view: function(vnode) {
			let line = vnode.attrs.line;
			return m('div', {class: 'specimen-line'},
				m('div.line-left-col',
					m(SizeInput, {params: line}),
					Fonts.list.length ? m(FontSelect, {params: line}) : ''
					),
				m('div.line-middle-col',
					line.font ?
					m('div', {class: 'text', style: {
						whiteSpace: "nowrap",
						fontSize: Layout.size.locked ? Layout.size.get() : line.size.get(),
						width: Layout.width.get(),
						fontFamily: Layout.fontLocked ? Layout.font?.name : line.font.name
					}}, line.text) : '',
				),
				m('div.line-right-col',
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
				m('div.specimen-body', 
						m('div.line-left-col',
							m(SizeInputGlobal),
							Fonts.list.length ? m(FontSelectGlobal) : ''
						),
						m('div.line-middle-col',
							m(WidthInput)
						),
						m('div.line-right-col',
							m(CaseSelectGlobal),
							m(CopyButton, {onclick: Layout.copyText}),
							m(UpdateButton, {onclick: Layout.update})
						),
					Layout.lines.map((line) => m(Line, {line}))
				)
			)
		}
	}
}

function FontItems(initialVnode) {
	let scrollState = 'start';
	let scroll = false;

	function onscroll() {
		const scroller = document.querySelector('.font-items-scroller');
		const scrollAmount = scroller.scrollWidth - scroller.offsetWidth;
		const scrollFromStart = scroller.scrollLeft;
		const scrollFromEnd = scrollAmount - scroller.scrollLeft;

		if (0 <= scrollFromStart && scrollFromStart < scrollAmount * 0.1) {
			scrollState = 'start';
		} else if (0 <= scrollFromEnd && scrollFromEnd < scrollAmount * 0.1) {
			scrollState = 'end';
		} else {
			scrollState = 'middle';
		}

		scroller.classList.remove('start', 'middle', 'end');
		scroller.classList.add(scrollState);
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
				onscroll();
				m.redraw();
			}).observe(vnode.dom.querySelector('.font-items-scroller'), {childList: true});

			onscroll();
		},
		view: function(vnode) {
			scroll = (() => {
				const scroller = document.querySelector('.font-items-scroller');
				if (!scroller) return false;
				return scroller.scrollWidth > scroller.offsetWidth;
			})();
			return m('div.font-items',
				scroll && scrollState !== 'start' ? m('button.scroll-left-button', {onclick: scrollToStart}, '◁') : '',
				m('div.font-items-scroller', {onscroll},
					Fonts.list.map(font => {
						return m(FontItem, {key: font.id, font: font})
					})
				),
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
					disabled: Layout.size.locked
				}, '－'),
				m('input', {
					type: 'text', 
					value: vnode.attrs.params.size.get(), 
					onchange: (e) => {vnode.attrs.params.size.set(e.currentTarget.value)},
					disabled: Layout.size.locked
				}),
				m('button', {
					onclick: () => { vnode.attrs.params.size.increment() },
					disabled: Layout.size.locked
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
					onclick: () => { Layout.size.decrement() },
					disabled: !Layout.size.locked
				}, '－'),
				m('input', {
					type: 'text', 
					value: Layout.size.get(),
					onchange: (e) => {Layout.size.set(e.currentTarget.value)},
					disabled: !Layout.size.locked
				}),
				m('button', {
					onclick: () => { Layout.size.increment() },
					disabled: !Layout.size.locked
				}, '＋'),
				m('button.size-input-lock', {
					onclick: () => {Layout.size.locked = !Layout.size.locked}
				}, `${Layout.size.locked ? '🔒' : '🔓'}`)
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
				disabled: Layout.filterLocked
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
					onclick: () => {Layout.filterLocked = !Layout.filterLocked}
				}, Layout.filterLocked ? '🔒' : '🔓'),
				m('select.case-select', {
					onchange: (e) => {Layout.filter = e.currentTarget.selectedIndex},
					disabled: !Layout.filterLocked
				},
				m('option', {value: 'lowercase', selected: Layout.filter == 0}, 'Lowercase'),
				m('option', {value: 'uppercase', selected: Layout.filter == 1}, 'Uppercase'),
				m('option', {value: 'capitalised', selected: Layout.filter == 2}, 'Capitalised')
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
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		view: function(vnode) {
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, vnode.attrs.params.font?.name),
				m('select', {
					oninput: (e) => {vnode.attrs.params.fontId = e.target.options[e.target.selectedIndex].value },
					disabled: Layout.fontLocked
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
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		view: function(vnode) {
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, Layout.font?.name),
				m('select', {
					oninput: (e) => {Layout.fontId = e.target.options[e.target.selectedIndex].value},
					disabled: !Layout.fontLocked
				},
				Fonts.list.map((font) => {
					return m('option', { value: font.id, selected: Layout.fontId == font.id}, font.name)
				})
				),
				m('button.font-select-lock', {
					onclick: () => {Layout.fontLocked = !Layout.fontLocked}
				}, Layout.fontLocked ? '🔒' : '🔓'),
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