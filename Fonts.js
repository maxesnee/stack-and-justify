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
		font.wordGenerator.sort().then(() => {
			// Dispatch event
			const event = new CustomEvent("font-added", {detail: {fontId: font.id}});
			window.dispatchEvent(event);
		});
		localStorage['fontList'] = JSON.stringify(list);
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

	return {
		list,
		add,
		get,
		first,
		remove
	}
})();