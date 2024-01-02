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
		return list.find(font => font.id == id) || null;
	}

	function first() {
		return list[0] || null;
	}

	async function update() {
		for (const font of list) {
			await font.update();
		}
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