import { Features } from './Features.js';
import { Size } from './Size.js';
import { Layout } from './Layout.js';
import { Filters } from './Filters.js';
import { generateUID } from './Helpers.js';

export function Line(size, font) {
	const id = generateUID();
	let text = "";
	let filter = 2;
	let featuresCSS = Features.css(font.id);
	size = Size(size.get());
	size.onchange = update;

	window.addEventListener('font-loaded', (e) => {
		if (e.detail.font === font) {
			update();
		}
	});

	function remove() {
		Layout.removeLine(id);
	}

	// Regenerate the text
	async function update() {
		const outputFont = Layout.fontLocked ? Layout.font : font;
		const outputFilter = Layout.filterLocked ? Layout.filter : filter;
		const outputSize = Layout.sizeLocked ? Layout.size.getIn('px') : size.getIn('px');
		const outputWidth = Layout.width.getIn('px');

		featuresCSS = Features.css(outputFont.id);

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
				if (Layout.font !== font) {
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
		id,
		size,
		get filter() {
			return filter;
		},
		set filter(value) {
			filter = parseInt(value);
			update();
		},
		get font() {
			return font
		},
		set font(value) {
			font = value;
			update();
		},
		get text() {
			return text;
		},
		get featuresCSS() {
			return featuresCSS;
		},
		remove,
		copyText,
		update,
		updateAfterLockChange,
	}
}