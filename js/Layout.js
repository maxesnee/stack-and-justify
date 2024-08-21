import { Line } from "./Line.js";
import { Size } from "./Size.js";
import { Filters } from "./Filters.js";
import { Box } from "./Helpers.js";

const defaultWidth = '15cm';
const defaultSize = '60pt';

export const Layout = (function() {
	let lines = [];
	let width = Size(defaultWidth);
	let size = Size(defaultSize);
	let sizeLocked = Box(true);
	let filter = Box(Filters[2]);
	let filterLocked = Box(true);
	let fontSelection = Box(null);
	let fontSelectionLocked = Box(false);

	window.addEventListener('font-added', (e) => {
		// If there's was no font before, select the one that's been added
		if (fontSelection.val == null) {
			fontSelection.val = e.detail.font;
		}
		addLine(Size(defaultSize), e.detail.font);
		m.redraw();
	});

	function copyText() {
		navigator.clipboard.writeText(lines.map(line => line.text).join('\n'));
	}

	async function update() {
		lines.forEach(line => {line.update()});
	}

	function addLine(size, font) {
		if (!size && !font && lines.length) {
			const lastLine = lines[lines.length-1];
			size = lastLine.size;
			font = lastLine.fontSelection.val;
		}
		lines.push(Line(size, font));
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

	function textAlreadyUsed(str) {
		return lines.find(line => line.text.val === str) ? true : false;
	}

	return {
		lines,
		width,
		size,
		filter,
		fontSelection,
		sizeLocked,
		filterLocked,
		fontSelectionLocked,
		addLine,
		removeLine,
		getLine,
		moveLine,
		indexOf,
		update,
		copyText,
		textAlreadyUsed
	}
})();