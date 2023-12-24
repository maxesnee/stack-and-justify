import { Font } from './Font.js';

export const Fonts = (function() {
	let list = [];

	if (localStorage['fontList']) {
		const localStorageList = JSON.parse(localStorage['fontList']);
		localStorageList.forEach(font => {
			add(Font(font.name, font.data));
		})
	}

	function add(font) {
		list.push(font);
		localStorage['fontList'] = JSON.stringify(list);
		m.redraw();
	}

	function remove(font) {
		list.splice(list.indexOf(font), 1);
		localStorage['fontList'] = JSON.stringify(list);

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