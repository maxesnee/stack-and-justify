import { Words } from "../Words.js";
import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";

export function Options(initialVnode) {
	let open = false;

	document.onclick = (e) => {
		const menu = document.querySelector('.options-menu');
		const btn = document.querySelector('.options-button');
		
		if (!menu.contains(e.target) && e.target !== btn && open) {
			open = false;
			m.redraw();
		}
	}

	async function update(e) {
		e.preventDefault();
		const form = document.querySelector('.options-menu');
		const formData = new FormData(form);
		const selectedLanguages = formData.getAll('languages');
		const selectedSources = formData.getAll('sources');

		for (const language of Words.data.languages) {
			if (selectedLanguages.includes(language.name)) {
				language.selected = true
			} else {
				language.selected = false;
			}
		}

		for (const source of Words.data.sources) {
			if (selectedSources.includes(source.name)) {
				source.selected = true
			} else {
				source.selected = false;
			}
		}

		Fonts.update();

		open = false;
		m.redraw();
	}

	return {
		view: function(vnode) {
			return m('div.options', 
				m('button.options-button', {onclick: () => { open = !open }}, "Options ▿"),
				m('form.options-menu', {style: {visibility: open ? 'visible' : 'hidden'}}, 
					m('fieldset',
						m('legend', 'Languages'),
						Words.data.languages.map(lang => {
							return m('div.checkbox', 
								m('input', {name: 'languages', type: 'checkbox', id:lang.name, value: lang.name, checked: lang.selected}),
								m('label', {for: lang.name}, lang.label)
								)
						})
						),
					m('fieldset', 
						m('legend', 'Sources'),
						Words.data.sources.map(source => {
							return m('div.checkbox',
								m('input', {name: 'sources', type: 'checkbox', id:source.name, value: source.name, checked: source.selected}),
								m('label', {for: source.name}, source.label)
								)
						})
						),
					m('div.options-update', 
						m('button.bold', {onclick: update},'↻ Update')
						)
					)
				)
		}
	}
}