export function FeaturesSubmenu(initialVnode) {
	const familyId = initialVnode.attrs.familyId;
	let open = true;
	let offsetHeight = null;
	let update = function() {};

	function toggle() {
		open = !open;
		update();
	};

	return {
		oncreate: function(vnode) {
			offsetHeight = vnode.dom.offsetHeight;
			update = function() {
				vnode.dom.querySelector('.features-submenu-content').style.maxHeight = open ? `${offsetHeight}px` : '0';
			}
			update();
		},
		view: function(vnode) {
			return m('fieldset.features-submenu',
				m('legend.features-submenu-header', {onclick: toggle},
					m('span', vnode.attrs.name),
					m('span.features-submenu-toggle', "▿")
				),
				m('div.features-submenu-content',
					vnode.attrs.list.map(feature => {
						return m('div.checkbox', 
							m('input', {name: familyId, 
										type: 'checkbox', 
										id: `${feature.tag}-${feature.id}`, 
										value: feature.id, 
										checked: feature.selected,
										// onchange: (e) => {feature.selected = e.currentTarget.checked},
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