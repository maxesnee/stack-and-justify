export const Filters = (function() {
	let selected = 2;

	const list = [
		{ value: 'lowercase', label: 'Lowercase'},
		{ value: 'uppercase', label: 'Uppercase'},
		{ value: 'capitalised', label: 'Capitalised'}
	];

	function select(i) {
		selected = i;
	}

	return {
		list,
		get selected() {
			return list[selected].value
		},
		select
	}
})();