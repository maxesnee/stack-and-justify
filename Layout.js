import { WordEngine } from "./WordEngine.js";
import { Filters } from "./Filters.js";

export const Layout = (function() {
	let width = parseInt(localStorage['width']) || 600;
	let sizeLocked = true;
	let size = 60;
	let filterLocked = true;
	let filter = 2;

	let globalSize = {
		get locked() {
			return sizeLocked;
		},
		set locked(value) {
			sizeLocked = value;
			update();
			
		},
		get size() {
			return size;
		},
		set size(value) {
			size = parseInt(value);
			update();
		},
	};

	let globalFilter = {
		get locked() {
			return filterLocked;
		},
		set locked(value) {
			filterLocked = value;
			update();
			
		},
		get filter() {
			return filter;
		},
		set filter(value) {
			filter = parseInt(value);
			update();
		},
	};

	let lines = [
		Line(60),
		Line(60)
	];

	function Line(size) {
		let text = "";
		let filter = 2;

		function update() {
			let outputFilter = globalFilter.locked ? globalFilter.filter : filter;
			let outputSize = globalSize.locked ? globalSize.size : size;
			text = WordEngine.getWord(outputSize, width, Filters.list[outputFilter].value);	
			
		}

		function copyText() {
			navigator.clipboard.writeText(text);
		}

		update();

		return {
			get size() {
				return size;
			},
			set size(value) {
				size = parseInt(value);
				update();
			},
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
				n;
			}
		} else {
			lines.length = n;
		}
	}

	function addLine() {
		lines.push(Line(60));
	}

	function removeLine() {
		lines.pop();
	}

	return {
		get width() {
			return width;
		},
		set width(value) {
			width = parseInt(value);
			localStorage['width'] = width;
			lines.forEach(line => line.update());
		},
		lines,
		addLine,
		removeLine,
		setLineCount,
		update,
		copyText,
		globalSize,
		globalFilter
	}
})();