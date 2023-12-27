import { Font } from './Font.js';

export const Fonts = (function() {
	let list = [];

	function add(font) {
		list.push(font);
		m.redraw();
	}

	function remove(font) {
		list.splice(list.indexOf(font), 1);

		// Dispatch event
		const event = new CustomEvent("font-removed", {detail: {fontId: font.id}});
		window.dispatchEvent(event);
	}

	function get(id) {
		return Fonts.list.find(font => font.id == id) || null;
	}

	function first() {
		return Fonts.list[0] || null;
	}

	function update() {
		Fonts.list.forEach(font => { font.update() });
	}

	return {
		list,
		add,
		get,
		first,
		update,
		remove
	}
})();