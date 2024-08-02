import { Words } from "../Words.js";
import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";

export function Options(initialVnode) {
	// Menu status
	let open = false;

	// Temporarily holds the selected options before they are applies
	let options = {
		languages: Object.fromEntries(Words.data.languages.map(lang => [lang.name, lang.selected])),
		sources: Object.fromEntries(Words.data.sources.map(source => [source.name, source.selected]))
	};

	// Close the menu when the user clicks anywhere else
	document.addEventListener('click', (e) => {
		const menu = document.querySelector('.options-menu');
		const btn = document.querySelector('.options-button');
		
		if (!menu.contains(e.target) && e.target !== btn && open) {
			open = false;
			m.redraw();
		}
	});

	async function update(e) {
		e.preventDefault();

		// Update the selection of languages and dictionaries
		for (const language of Words.data.languages) {
			language.selected = options.languages[language.name];
		}

		for (const source of Words.data.sources) {
			source.selected = options.sources[source.name];
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
								m('input', {
									name: 'languages', 
									type: 'checkbox', 
									id:lang.name, 
									value: lang.name, 
									checked: options.languages[lang.name],
									onclick: (e) => { options.languages[lang.name] = e.currentTarget.checked }
								}),
								m('label', {for: lang.name}, lang.label)
							)
						})
					),
					m('fieldset', 
						m('legend', 'Sources'),
						Words.data.sources.map(source => {
							return m('div.checkbox',
								m('input', {
									name: 'sources', 
									type: 'checkbox', 
									id:source.name, 
									value: source.name, 
									checked: options.sources[source.name],
									onclick: (e) => { options.sources[source.name] = e.currentTarget.checked }
								}),
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