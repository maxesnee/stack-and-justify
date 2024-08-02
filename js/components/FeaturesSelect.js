import { Layout } from "../Layout.js";
import { Features } from "../Features.js";
import { Fonts } from "../Fonts.js";
import { FeaturesSubmenu } from "./FeaturesSubmenu.js";
import { generateUID } from "../Helpers.js";

export function FeaturesSelect(initialVnode) {
	let open = false;
	const familyIds = {};

	function update(e) {
		e.preventDefault();

		const fontsToUpdate = new Set();

		const form = document.querySelector('.features-menu');
		const formData = new FormData(form);
		const featuresToUpdate = Array.from(formData.values());

		// Update the features list to match the form, and mark the fonts to be updated
		for (const familyGroup of Features.list) {
			for (const feature of familyGroup.features) {
				if (featuresToUpdate.includes(feature.id)) {
					// If the feature wasn't selected before, mark the fonts to update
					if (feature.selected === false) feature.fontIds.forEach(fontId => fontsToUpdate.add(fontId));

					feature.selected = true;
				} else {
					// Same, if the feature WAS selected before, mark the fonts to update
					if (feature.selected === true) feature.fontIds.forEach(fontId => fontsToUpdate.add(fontId));

					feature.selected = false;
				}
			}
		}

		// Update the fonts to match the new features selection
		for (const id of fontsToUpdate.values()) {
			Fonts.get(id).update();
		}
		
		open = false;
		m.redraw();
	}

	return {
		oncreate: function(vnode) {
			document.addEventListener('click', (e) => {
				const menu = vnode.dom.querySelector('.features-menu');
				const btn = vnode.dom.querySelector('.features-button');

				if (!menu.contains(e.target) && e.target !== btn && open) {
					open = false;
					m.redraw();
				}
			});
		},
		view: function(vnode) {
			return m('div.features',
				m('button.features-button', {onclick: () => { open = !open }, disabled: Layout.featuresLocked}, "Features ▿"),
				m('form.features-menu', {style: {visibility: open ? 'visible' : 'hidden'}}, 
					Features.list.map(familyGroup => {
						return m(FeaturesSubmenu, {familyId: familyGroup.id, name: familyGroup.name, list: familyGroup.features})
					}),
					m('div.features-update', 
						m('button.bold', {onclick: update},'↻ Update')
					)
				)
			)
		}
	}
}