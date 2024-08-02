import { Layout } from "../Layout.js";
import { Features } from "../Features.js";
import { Fonts } from "../Fonts.js";
import { FeaturesSubmenu } from "./FeaturesSubmenu.js";
import { generateUID } from "../Helpers.js";

export function FeaturesSelect(initialVnode) {
	// Menu status
	let open = false;

	let needsUpdate = false;

	// Temporarily holds the selected features before they are applies
	let selectedFeatures = {};

	addEventListener('font-added', (e) => {
		selectedFeatures = Object.fromEntries(Features.list.map(familyGroup => {
			return [familyGroup.id, Object.fromEntries(familyGroup.features.map(feature => [feature.id, feature.selected]))];
		}));
	});


	function update(e) {
		e.preventDefault();

		const fontsToUpdate = new Set();

		// Update the features list to match the form, and mark the fonts to be updated
		for (const familyGroup of Features.list) {
			for (const feature of familyGroup.features) {
				// If the selection changed, mark the fonts to be updated
				if (feature.selected !== selectedFeatures[familyGroup.id][feature.id]) {
					feature.fontIds.forEach(fontId => fontsToUpdate.add(fontId));
				}
				feature.selected = selectedFeatures[familyGroup.id][feature.id];
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
					Features.list.map(familyGroup => {
						return m(FeaturesSubmenu, {
							family: familyGroup, 
							selectedFeatures, 
							onchange: () => { needsUpdate = true }
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