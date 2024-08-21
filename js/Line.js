import { Features } from './Features.js';
import { Size } from './Size.js';
import { Layout } from './Layout.js';
import { Filters } from './Filters.js';
import { generateUID, Box, Computed } from './Helpers.js';

export function Line(_size, _font) {
	const id = generateUID();
	let size = Size(_size.get());
	let font = Box(_font);
	let filter = Box(Filters[2]);
	
	const outputFont = Computed(() => Layout.fontLocked.val ? Layout.font.val : font.val);
	outputFont.dependsOn(Layout.font, Layout.fontLocked, font);

	const outputFilter = Computed(() => Layout.filterLocked.val ? Layout.filter.val : filter.val);
	outputFilter.dependsOn(Layout.filter, Layout.filterLocked, filter);

	const outputSize = Computed(() => Layout.sizeLocked.val ? Layout.size.getIn('px') : size.getIn('px'));
	outputSize.dependsOn(Layout.sizeLocked, Layout.size, size);

	const text = Computed(() => {
		const textOptions = outputFont.val.wordGenerator.getWords(outputSize.val, Layout.width.getIn('px'), outputFilter.val, Layout.lines.length);
		return textOptions.find(option => !Layout.textAlreadyUsed(option)) || "";
	});
	text.dependsOn(Layout.width, outputFont, outputSize, outputFilter);

	window.addEventListener('font-loaded', (e) => {
		if (e.detail.font === outputFont.val) {
			text.update();
			m.redraw();
		}
	});

	function remove() {
		Layout.removeLine(id);
	}

	function copyText() {
		navigator.clipboard.writeText(text.val);
	}

	return {
		id,
		size,
		filter,
		font,
		text,
		get featuresCSS() {
			return Features.css(outputFont.val.id);
		},
		update: text.update,
		remove,
		copyText
	}
}