import { Fonts } from './Fonts.js';
import { Features } from './Features.js';
import { Size } from './Size.js';
import { Layout } from './Layout.js';
import { Filters } from './Filters.js';
import { generateUID } from './Helpers.js';

export function Line(size, fontId) {
	const id = generateUID();
	let text = "";
	let filter = 2;
	let featuresCSS = Features.css(fontId);
	size = Size(size.get());
	size.onchange = update;


	window.addEventListener('font-loaded', (e) => {
		if (e.detail.fontId === fontId) {
			update();
		}
	});

	function remove() {
		Layout.removeLine(id);
	}

	// Regenerate the text
	async function update() {
		const outputFontId = Layout.fontLocked ? Layout.fontId : fontId;
		const outputFont = Fonts.find(font => font.id === outputFontId);
		if (!outputFont) return;

		const outputFilter = Layout.filterLocked ? Layout.filter : filter;
		const outputSize = Layout.sizeLocked ? Layout.size.getIn('px') : size.getIn('px');
		const outputWidth = Layout.width.getIn('px');

		featuresCSS = Features.css(outputFontId);

		text = '';
		const textOptions = await outputFont.wordGenerator.getWords(outputSize, outputWidth, Filters.list[outputFilter].value, Layout.lines.length);

		textOptions.forEach(option => {
			if (!Layout.textAlreadyUsed(option)) {
				text = option;
				return;
			}
		});
		
		m.redraw();
	}

	// Regenerate the text only if the line’s parameter differs from global parameters
	async function updateAfterLockChange(parameter) {
		switch (parameter) {
			case 'font':
				if (Layout.fontId !== fontId) {
					update();
				}
				break;
			case 'size':
				if (Layout.size.get() !== size.get()) {
					update();
				}
				break;
			case 'filter':
				if (Layout.filter !== filter) {
					update();
				}
				break;

		}
	}

	function copyText() {
		navigator.clipboard.writeText(text);
	}

	update();

	return {
		update,
		updateAfterLockChange,
		size,
		get filter() {
			return filter;
		},
		set filter(value) {
			filter = parseInt(value);
			update();
		},
		get text() {
			return text;
		},
		set text(value) {
			text = value;
		},
		get fontId() {
			return fontId
		},
		set fontId(value) {
			fontId = value;
			update();
		},
		get font() {
			return Fonts.find(font => font.id === fontId);
		},
		get featuresCSS() {
			return featuresCSS
		},
		id,
		remove,
		copyText,
		locked: false
	}
}