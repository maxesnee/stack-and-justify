import { Size } from './Size.js';
import { Layout } from './Layout.js';
import { generateUID, Box, Computed } from './Helpers.js';

export function Line(_font, _size, _filter) {
	const id = generateUID();
	let font = Box(_font);
	let size = Size(_size.get());
	let filter = Box(_filter);
	
	const outputFont = Computed(() => Layout.fontLocked.val ? Layout.font.val : font.val);
	outputFont.dependsOn(Layout.font, Layout.fontLocked, font);

	const outputSize = Computed(() => Layout.sizeLocked.val ? Layout.size.getIn('px') : size.getIn('px'));
	outputSize.dependsOn(Layout.sizeLocked, Layout.size, size);

	const outputFilter = Computed(() => Layout.filterLocked.val ? Layout.filter.val : filter.val);
	outputFilter.dependsOn(Layout.filter, Layout.filterLocked, filter);

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
		font,
		size,
		filter,
		outputFont,
		outputSize,
		outputFilter,
		text,
		update: text.update,
		remove,
		copyText
	}
}