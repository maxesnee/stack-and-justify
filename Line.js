import { Fonts } from './Fonts.js';
import { Size } from './Size.js';
import { Layout } from './Layout.js';
import { Filters } from './Filters.js';

export function Line(size, fontId=Fonts.first()?.id) {
	if (typeof size === 'string') {
		size = Size(size)
	} else {
		size = Size(size.get());
	}

	let text = "";
	let filter = 2;

	size.onchange = update;

	window.addEventListener('font-added', (e) => {
			// If there's was no font before, select the one that's been added
		if (fontId == null) {
			fontId = e.detail.fontId;
		}
		update();
	});

	window.addEventListener('font-removed', (e) => {
			// The selected font has been removed, we need to select another one
		if (fontId == e.detail.fontId) {
			fontId = Fonts.first()?.id;
		}
		update();
	});

	async function update() {
		const outputFontId = Layout.fontLocked ? Layout.fontId : fontId;
		const outputFont = Fonts.get(outputFontId);
		if (!outputFont) return;

		const outputFilter = Layout.filterLocked ? Layout.filter : filter;
		const outputSize = Layout.size.locked ? Layout.size.getIn('px') : size.getIn('px');
		const outputWidth = Layout.width.getIn('px');
		text = await outputFont.wordGenerator.getLine(outputSize, outputWidth, Filters.list[outputFilter].value);
		m.redraw();
	}

	function copyText() {
		navigator.clipboard.writeText(text);
	}

	update();

	return {
		size,
		get filter() {
			return filter;
		},
		set filter(value) {
			filter = parseInt(value);
			update();
		},
		update,
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
		copyText,
		locked: false
	}
}