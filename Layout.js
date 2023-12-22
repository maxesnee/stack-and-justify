import { WordEngine } from "./WordEngine.js";
import { Filters } from "./Filters.js";
import { Size } from "./Size.js";

export const Layout = (function() {
	let width = Size(localStorage['width'] || '600px');
	width.onchange = () => {
		localStorage['width'] = width.get();
		update();
	};

	let sizeLocked = true;
	let globalSize = Size(localStorage['globalSize'] || '60px');
	globalSize.onchange = () => {
		localStorage['globalSize'] = globalSize.get();
		update();
	}
	Object.defineProperty(globalSize, 'locked', {
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


	let globalFilter = {
		get locked() {
			return filterLocked;
		},
		set locked(value) {
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
	};

	let lines = [
		Line('60px'),
		Line('60px')
	];

	function Line(_size) {
		let size = Size(_size);
		let text = "";
		let filter = 2;

		size.onchange = update;

		async function update() {
			let outputFilter = globalFilter.locked ? globalFilter.filter : filter;
			let outputSize = globalSize.locked ? globalSize.getIn('px') : size.getIn('px');
			let outputWidth = width.getIn('px');
			text = await WordEngine.getWord(outputSize, outputWidth, Filters.list[outputFilter].value);	
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
			copyText,
			locked: false
		}
	}

	function copyText() {
		navigator.clipboard.writeText(lines.map(line => line.text).join('\n'));
	}

	function update() {
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

	function addLine() {
		lines.push(Line('60px'));
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
		globalSize,
		globalFilter
	}
})();