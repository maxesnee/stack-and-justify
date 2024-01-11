import { Font } from './Font.js';
import { Layout } from './Layout.js';

export const Fonts = (function() {
	let list = [];

	function add(font) {
		list.push(font);
		
		Layout.addLine("default", font.id);
		m.redraw();

		// Dispatch event
		const event = new CustomEvent("font-added", {detail: {fontId: font.id}});
		window.dispatchEvent(event);
	}

	function remove(font) {
		list.splice(list.indexOf(font), 1);

		// Dispatch event
		const event = new CustomEvent("font-removed", {detail: {fontId: font.id}});
		window.dispatchEvent(event);
	}

	function move(font, to) {
		const from = list.indexOf(font);
		if (from === -1 || to === from) return;

		const target = list[from];                         
		const increment = to < from ? -1 : 1;

		for(let k = from; k != to; k += increment){
			list[k] = list[k + increment];
		}
		list[to] = target;
	}

	function get(id) {
		return list.find(font => font.id == id) || null;
	}

	function first() {
		return list[0] || null;
	}

	function last() {
		return list[list.length-1] || null;
	}

	function indexOf(id) {
		return list.indexOf(get(id));
	}

	async function update() {
		for (const font of list) {
			await font.update();
		}
	}

	return {
		get list() {
			return list;
		},
		add,
		get,
		indexOf,
		move,
		first,
		update,
		remove
	}
})();