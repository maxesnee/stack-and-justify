import { Fonts } from './Fonts.js';
import { Size } from './Size.js';
import { Layout } from './Layout.js';
import { Filters } from './Filters.js';
import { generateUID } from './Helpers.js';

export function Line(size, fontId=Fonts.first()?.id) {
	if (typeof size === 'string') {
		size = Size(size)
	} else {
		size = Size(size.get());
	}

	let text = "";
	let filter = 2;
	const id = generateUID();

	size.onchange = update;

	window.addEventListener('font-added', (e) => {
		// If there's was no font before, select the one that's been added
		if (fontId == null) {
			fontId = e.detail.fontId;
		}
	});

	window.addEventListener('font-loaded', (e) => {
		update();
	});

	window.addEventListener('font-removed', (e) => {
			// The selected font has been removed, we need to select another one
		if (fontId == e.detail.fontId) {
			fontId = Fonts.first()?.id;
		}
		update();
	});

	function remove() {
		Layout.removeLine(id);
	}

	// Regenerate the text
	async function update() {
		const outputFontId = Layout.fontLocked ? Layout.fontId : fontId;
		const outputFont = Fonts.get(outputFontId);
		if (!outputFont) return;

		const outputFilter = Layout.filterLocked ? Layout.filter : filter;
		const outputSize = Layout.sizeLocked ? Layout.size.getIn('px') : size.getIn('px');
		const outputWidth = Layout.width.getIn('px');
		text = await outputFont.wordGenerator.getLine(outputSize, outputWidth, Filters.list[outputFilter].value);
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
			return Fonts.get(fontId);
		},
		id,
		remove,
		copyText,
		locked: false
	}
}