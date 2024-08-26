import { Words } from "../Words.js";
import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";

export function OptionsMenu(initialVnode) {
	// Menu status
	let open = false;

	let needsUpdate = false;

	// Temporarily holds the selected options before they are applies
	let options = {
		languages: Object.fromEntries(Words.data.languages.map(lang => [lang.name, lang.selected])),
		sources: Object.fromEntries(Words.data.sources.map(source => [source.name, source.selected]))
	};

	async function update(e) {
		e.preventDefault();

		// Update the selection of languages and dictionaries
		for (const language of Words.data.languages) {
			language.selected = options.languages[language.name];
		}

		for (const source of Words.data.sources) {
			source.selected = options.sources[source.name];
		}

		Fonts.updateAll();

		open = false;
		needsUpdate = false;
	}

	return {
		oncreate: function(vnode) {
			// Close the menu when the user clicks anywhere else
			document.addEventListener('click', (e) => {
				const menu = vnode.dom.querySelector('.menu');
				const btn = vnode.dom.querySelector('.menu-button');

				if (!menu.contains(e.target) && e.target !== btn && open) {
					open = false;
					m.redraw();
				}
			});
		},
		view: function(vnode) {
			return m('div.menu-container', 
				m('button.menu-button', {onclick: () => { open = !open }}, "Options ▿"),
				m('form.menu', {style: {visibility: open ? 'visible' : 'hidden'}}, 
					m('fieldset.submenu',
						m('legend.submenu-header', 'Languages'),
						m('div.submenu-content',
							Words.data.languages.map(lang => {
								return m('div.checkbox', 
									m('input', {
										name: 'languages', 
										type: 'checkbox', 
										id:lang.name, 
										value: lang.name, 
										checked: options.languages[lang.name],
										onclick: (e) => { options.languages[lang.name] = e.currentTarget.checked; needsUpdate = true; }
									}),
									m('label', {for: lang.name}, lang.label)
								)
							})
						)
					),
					m('fieldset.submenu', 
						m('legend.submenu-header', 'Sources'),
						m('div.submenu-content',
							Words.data.sources.map(source => {
								return m('div.checkbox',
									m('input', {
										name: 'sources', 
										type: 'checkbox', 
										id:source.name, 
										value: source.name, 
										checked: options.sources[source.name],
										onclick: (e) => { options.sources[source.name] = e.currentTarget.checked; needsUpdate = true; }
									}),
									m('label', {for: source.name}, source.label)
									)
							})
						)
					),
					m('div.menu-update', {class: !needsUpdate ? "disabled" : ""},
						m('button.bold', {disabled: !needsUpdate, onclick: update},'↻ Update')
					)
				)
			)
		}
	}
}