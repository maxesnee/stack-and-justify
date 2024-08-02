import { Layout } from "../Layout.js";
import { Features } from "../Features.js";
import { Fonts } from "../Fonts.js";
import { FeaturesSubmenu } from "./FeaturesSubmenu.js";
import { generateUID } from "../Helpers.js";

export function FeaturesSelect(initialVnode) {
	// Menu status
	let open = false;
	let needsUpdate = false;

	let menu = [];
	addEventListener('font-added', (e) => {
		menu = Features.list.map(family => {
			return {
				familyId: family.id,
				familyName: family.name,
				open: false,
				features: family.features.map(feature => {
					return {
						id: feature.id,
						tag: feature.tag,
						name: feature.name,
						selected: feature.selected
					}
				})
			};
		});
		menu[0].open = true;
	});

	function update(e) {
		e.preventDefault();

		const fontsToUpdate = new Set();

		// Update the features list to match the form, and mark the fonts to be updated
		for (const submenu of menu) {
			for (const menuFeature of submenu.features) {
				const feature = Features.get(menuFeature.id);
				// If the selection changed, mark the fonts to be updated
				if (feature.selected !== menuFeature.selected) {
					feature.fontIds.forEach(fontId => fontsToUpdate.add(fontId));
				}
				feature.selected = menuFeature.selected;
			}
		}

		// Update the fonts to match the new features selection
		for (const id of fontsToUpdate.values()) {
			Fonts.get(id).update();
		}
		
		open = false;
		needsUpdate = false;

		m.redraw();
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
				m('button.menu-button', { disabled: !Fonts.list.length, onclick: () => { open = !open }}, "Features ▿"),
				m('form.menu', {style: {visibility: open ? 'visible' : 'hidden'}}, 
					menu.map(submenu => {
						return m(FeaturesSubmenu, {
							key: submenu.familyId,
							submenu,
							onchange: () => { needsUpdate = true },
						});
					}),
					m('div.menu-update', 
						m('button.bold', {disabled: !needsUpdate, onclick: update},'↻ Update')
					)
				)
			)
		}
	}
}