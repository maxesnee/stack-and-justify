import { Filters } from "./Filters.js";
import { Fonts } from "./Fonts.js";
import { Size } from "./Size.js";
import { Line } from "./Line.js";

export const Layout = (function() {
	let width = Size(localStorage['width'] || '600px');
	width.onchange = () => {
		localStorage['width'] = width.get();
		update();
	};

	let sizeLocked = true;
	let size = Size(localStorage['globalSize'] || '60px');
	size.onchange = () => {
		localStorage['globalSize'] = size.get();
		update();
	}
	Object.defineProperty(size, 'locked', {
		get() {
			return sizeLocked;
		},
		set(value) {
			sizeLocked = value;
			update();
		}
	});

	let filterLocked = localStorage['filterLocked'] === 'false' ? false : true;
	let filter = localStorage['filter'] || 2;

	let fontLocked = localStorage['fontLocked'] === 'false' ? false : true;
	let fontId = Fonts.first()?.id;

	// let globalFont = {
	// 	get locked() {
	// 		return fontLocked;
	// 	},
	// 	set locked(value) {
	// 		fontLocked = value;
	// 		localStorage['fontLocked'] = value;
	// 		update();	
	// 	},
	// 	get id() {
	// 		return fontId;
	// 	},
	// 	set id(value) {
	// 		fontId = value;
	// 		update();
	// 	},
	// 	get font() {
	// 		return Fonts.get(fontId);
	// 	}
	// }

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

	let lines = [];

	function copyText() {
		// Write plain text to the clipboard
		navigator.clipboard.writeText(lines.map(line => line.text).join('\n'));
	}

	async function update() {
		lines.forEach(line => {line.update()});
	}

	function setLineCount(n) {
		if (n > lines.length) {
			while (n > lines.length) {
				addLine();
			}
		} else {
			lines.length = n;
		}
	}

	function addLine(size, fontId) {
		if (!size || !fontId && lines.length) {
			const lastLine = lines[lines.length-1];
			size = lastLine.size;
			fontId = lastLine.fontId;
		}
		lines.push(Line(size, fontId));
	}

	function removeLine() {
		lines.pop();
	}

	return {
		lines,
		addLine,
		removeLine,
		setLineCount,
		update,
		copyText,
		width,
		size,
		get filterLocked() {
			return filterLocked;
		},
		set filterLocked(value) {
			filterLocked = value;
			localStorage['filterLocked'] = value;
			update();
			
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
			update();	
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