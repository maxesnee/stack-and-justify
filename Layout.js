import { WordEngine } from "./WordEngine.js";
import { Filters } from "./Filters.js";

export const Layout = (function() {
	let width = localStorage['width'] || 600;
	let lines = [
		Line(60),
		Line(60)
	];

	function Line(size) {
		let text = "";

		function update() {
			text = WordEngine.getWord(size, width, Filters.selected);
		}

		update();

		return {
			get size() {
				return size;
			},
			set size(value) {
				size = value;
				update();
			},
			update,
			get text() {
				return text;
			}
		}
	}

	function addLine() {
		lines.push(Line(60));
	}

	return {
		get width() {
				return width;
		},
		set width(value) {
			width = value;
			localStorage['width'] = value;
			lines.forEach(line => line.update());
		},
		lines,
		addLine
	}
})();