import { WordEngine } from "./WordEngine.js";
import { Filters } from "./Filters.js";
import { Size } from "./Size.js";

export const Layout = (function() {
	// let width = parseInt(localStorage['width']) || 600;
	let width = Size('600px');
	let sizeLocked = true;
	let size = Size('60px');
	let filterLocked = true;
	let filter = 2;

	let globalWidth = {
		get() {
			return width.get()
		},
		set(value) {
			width.set(value);
			update();
		},
		getIn: width.getIn,
		setIn(srcUnit, newValue) {
			width.setIn(srcUnit, newValue);
			update();
		} 
	}

	let globalSize = {
		get locked() {
			return sizeLocked;
		},
		set locked(value) {
			sizeLocked = value;
			update();
		},
		get: function() {
			return size.get();
		},
		set: function(value) {
			size.set(value);
			update();
		},
		increment: function() {
			size.increment();
			update();
		},
		decrement: function() {
			size.decrement();
			update();
		},
		getIn: size.getIn
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
		Line('60px'),
		Line('60px')
	];

	function Line(_size) {
		let size = Size(_size);
		let text = "";
		let filter = 2;

		size.onchange = update;

		function update() {
			let outputFilter = globalFilter.locked ? globalFilter.filter : filter;
			let outputSize = globalSize.locked ? globalSize.getIn('px') : size.getIn('px');
			let outputWidth = globalWidth.getIn('px');
			text = WordEngine.getWord(outputSize, outputWidth, Filters.list[outputFilter].value);	
			
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
				n;
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
		globalWidth,
		globalSize,
		globalFilter
	}
})();