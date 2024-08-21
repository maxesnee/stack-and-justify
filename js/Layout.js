import { Line } from "./Line.js";
import { Size } from "./Size.js";
import { Filters } from "./Filters.js";
import { Box } from "./Helpers.js";

export const defaultWidth = Size('15cm');
export const defaultSize = Size('60pt');
export const defaultFilter = Filters[2];

export const Layout = (function() {
	let lines = [];
	let width = Size(defaultWidth.get());
	let size = Size(defaultSize.get());
	let sizeLocked = Box(true);
	let filter = Box(defaultFilter);
	let filterLocked = Box(true);
	let font = Box(null);
	let fontLocked = Box(false);

	window.addEventListener('font-added', (e) => {
		// If there's was no font before, select the one that's been added
		if (font.val == null) {
			font.val = e.detail.font;
		}
		addLine(e.detail.font, defaultSize, defaultFilter);
		m.redraw();
	});

	function copyText() {
		navigator.clipboard.writeText(lines.map(line => line.text.val).join('\n'));
	}

	async function update() {
		lines.forEach(line => {line.update()});
	}

	function addLine(_font, _size, _filter) {
		if (!_font && !_size && !_filter) {
			if (lines.length) {
				const lastLine = lines[lines.length-1];
				_font = lastLine.font.val;
				_size = lastLine.size;
				_filter = lastLine.filter.val;
			} else {
				_font = font.val;
				_size = defaultSize;
				_filter = defaultFilter;
			}
		}
		lines.push(Line(_font, _size, _filter));
	}

	function moveLine(line, to) {
		const from = lines.indexOf(line);
		if (from === -1 || to === from) return;

		const target = lines[from];                         
		const increment = to < from ? -1 : 1;

		for(let k = from; k != to; k += increment){
			lines[k] = lines[k + increment];
		}
		lines[to] = target;
	}

	function getLine(id) {
		return lines.find(line => line.id === id) || null;
	}

	function indexOf(id) {
		return lines.indexOf(getLine(id));
	}

	function removeLine(id) {
		if (id === undefined) {
			lines.pop();	
		} else {
			const index = lines.indexOf(lines.find(line => line.id === id));
			lines.splice(index, 1);
		}	
	}

	function clear() {
		lines.length = 0;
	}

	function textAlreadyUsed(str) {
		return lines.find(line => line.text.val === str) ? true : false;
	}

	return {
		lines,
		width,
		size,
		filter,
		font,
		sizeLocked,
		filterLocked,
		fontLocked,
		addLine,
		removeLine,
		getLine,
		moveLine,
		indexOf,
		update,
		copyText,
		clear,
		textAlreadyUsed,

	}
})();