import { Layout } from "./Layout.js";
import { WordEngine } from "./WordEngine.js";

export const Filters = (function() {
	let selected = localStorage['selectedFilter'] || 2;

	const list = [
		{ value: 'lowercase', label: 'Lowercase'},
		{ value: 'uppercase', label: 'Uppercase'},
		{ value: 'capitalised', label: 'Capitalised'}
	];

	WordEngine.setFilter(list[selected].value);

	function select(i) {
		selected = i;
		localStorage['selectedFilter'] = i;
		WordEngine.setFilter(list[i].value);
		WordEngine.sort();
		Layout.lines.forEach(line => line.update());
	}

	return {
		list,
		get selected() {
			return selected
		},
		select
	}
})();