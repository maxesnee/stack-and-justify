import { Fonts } from "./Fonts.js";
import { Line } from "./Line.js";
import { Size } from "./Size.js";

export const Layout = (function() {
	const defaultWidth = '15cm';
	const defaultSize = '60pt';

	let lines = [];

	let width = Size(defaultWidth);
	width.onchange = () => {
		update();
	};

	let size = Size(defaultSize);
	size.onchange = () => {
		update();
	}
	let sizeLocked = true;

	let filter = 2;
	let filterLocked = true;

	let fontId = null;
	let fontLocked = false;

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

	function copyText() {
		// Write plain text to the clipboard
		navigator.clipboard.writeText(lines.map(line => line.text).join('\n'));
	}

	async function update() {
		lines.forEach(line => {line.update()});
	}

	async function updateAfterLockChange(parameter) {
		lines.forEach(line => {line.updateAfterLockChange(parameter)});
	}

	function addLine(size, fontId) {
		if (!size && !fontId && lines.length) {
			const lastLine = lines[lines.length-1];
			size = lastLine.size;
			fontId = lastLine.fontId;
		}
		if (!size || size === "default") {
			size = defaultSize;
		}

		lines.push(Line(size, fontId));
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
		lines = [];
	}

	return {
		get lines() {
			return lines;
		},
		addLine,
		removeLine,
		clear,
		update,
		clear,
		copyText,
		width,
		size,
		get sizeLocked() {
			return sizeLocked;
		},
		set sizeLocked(value) {
			sizeLocked = value;
			updateAfterLockChange('size');
		},
		get filterLocked() {
			return filterLocked;
		},
		set filterLocked(value) {
			filterLocked = value;
			localStorage['filterLocked'] = value;
			updateAfterLockChange('filter');
			
		},
		get filter() {
			return filter;
		},
		set filter(value) {
			filter = parseInt(value);
			localStorage['filter'] = value;
			update();
		},
		get fontLocked() {
			return fontLocked;
		},
		set fontLocked(value) {
			fontLocked = value;
			localStorage['fontLocked'] = value;
			updateAfterLockChange('font');	
		},
		get fontId() {
			return fontId;
		},
		set fontId(value) {
			fontId = value;
			update();
		},
		get font() {
			return Fonts.get(fontId);
		}
	}
})();