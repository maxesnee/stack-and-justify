import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";
import { generateUID } from "../Helpers.js";

export function FeaturesMenu(initialVnode) {
	let open = false;
	let needsUpdate = false;

	function update(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		Fonts.updateFeatures(formData);
		
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
			const familiesWithFeatures = Fonts.list.filter(family => family.features.length);
			const disabled = familiesWithFeatures.length === 0;
			
			return m('div.menu-container',
				m('button.menu-button', { 
					class: disabled ? "disabled" : "",
					disabled, 
					onclick: () => { open = !open }
				}, "Features ▿"),
				m('form.menu', {onsubmit: update, style: {visibility: open ? 'visible' : 'hidden'}}, 
					familiesWithFeatures.map(family => {
						return m(FeaturesSubmenu, {
							key: family.id,
							family,
							open: true,
							onchange: () => { needsUpdate = true },
						});
					}),
					m('div.menu-update', {class: !needsUpdate ? "disabled" : ""}, 
						m('button.bold', {type: 'submit', disabled: !needsUpdate},'↻ Update')
					)
				)
			)
		}
	}
}

export function FeaturesSubmenu(initialVnode) {
	let open = initialVnode.attrs.open;
	let offsetHeight = null;
	let update = function() {};

	return {
		oncreate: function(vnode) {
			offsetHeight = vnode.dom.offsetHeight;
		},
		onupdate: function(vnode) {
			vnode.dom.querySelector('.submenu-content').style.maxHeight = open ? `${offsetHeight}px` : '0';
		},
		view: function(vnode) {
			const family = vnode.attrs.family;
			return m('fieldset.submenu',
				m('legend.submenu-header.submenu-toggle', {onclick: () => { open = !open }, class: open ? "open" : "closed"},
					m('span', family.name),
					m('span.submenu-toggle', "▿")
				),
				m('div.submenu-content',
					family.features.map(feature => {
						return m(FeatureCheckbox, {
							key: feature.id,
							family,
							feature,
							onchange: vnode.attrs.onchange
						});
					})
				)
			);
		}
 	}
}

function FeatureCheckbox(initialVnode) {
	let checked = initialVnode.attrs.feature.selected;

	return {
		view: function(vnode) {
			const family = vnode.attrs.family;
			const feature = vnode.attrs.feature;
			return m('div.checkbox', 
				m('input', {name: family.id, 
							type: 'checkbox', 
							id: `${feature.tag}-${feature.id}`, 
							value: feature.id, 
							checked: checked,
							onchange: (e) => {checked = e.currentTarget.checked; vnode.attrs.onchange()},
					}
				),
				m('label', {for: `${feature.tag}-${feature.id}`}, 
					m('span.feature-tag', feature.tag),
					m('span', feature.name)
				)
			)
		}
	}
}