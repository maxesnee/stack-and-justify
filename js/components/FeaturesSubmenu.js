export function FeaturesSubmenu(initialVnode) {
	let offsetHeight = null;
	let update = function() {};

	return {
		oncreate: function(vnode) {
			offsetHeight = vnode.dom.offsetHeight;
		},
		onupdate: function(vnode) {
			vnode.dom.querySelector('.submenu-content').style.maxHeight = vnode.attrs.submenu.open ? `${offsetHeight}px` : '0';
		},
		view: function(vnode) {
			const submenu = vnode.attrs.submenu;
			return m('fieldset.submenu',
				m('legend.submenu-header', {onclick: () => { submenu.open = !submenu.open }, class: submenu.open ? "open" : "closed"},
					m('span', submenu.familyName),
					m('span.submenu-toggle', "▿")
				),
				m('div.submenu-content',
					submenu.features.map(feature => {
						return m('div.checkbox', 
							m('input', {name: submenu.familyId, 
										type: 'checkbox', 
										id: `${feature.tag}-${feature.id}`, 
										value: feature.id, 
										checked: feature.selected,
										onchange: (e) => {feature.selected = e.currentTarget.checked; vnode.attrs.onchange()},
								}
							),
							m('label', {for: `${feature.tag}-${feature.id}`}, 
								m('span.feature-tag', feature.tag),
								m('span', feature.name)
							)
						)
					})
				)
			);
		}
 	}
}