import { Font } from './Font.js';
import { Layout } from './Layout.js';

export const Fonts = (function() {
	let list = [];

	if (localStorage['fontList']) {
		const localStorageList = JSON.parse(localStorage['fontList']);
		localStorageList.forEach(font => {
			add(Font(font.name, font.data));
		})
		update();
	}

	async function update() {
		const promises = [];
		list.forEach(font => {
			promises.push(font.wordGenerator.sort());
		});
		await Promise.all(promises);
		Layout.update();
	}

	function add(font) {
		list.push(font);
		localStorage['fontList'] = JSON.stringify(list);
		console.log(list);
	}

	function remove(font) {
		list.splice(list.indexOf(font), 1);
		localStorage['fontList'] = JSON.stringify(list);
		Layout.update();
		console.log(list);
	}

	return {
		list,
		add,
		remove,
		update
	}

})();