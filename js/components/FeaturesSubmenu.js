export function FeaturesSubmenu(initialVnode) {
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
				vnode.dom.querySelector('.submenu-content').style.maxHeight = open ? `${offsetHeight}px` : '0';
			}
			update();
		},
		view: function(vnode) {
			const family = vnode.attrs.family;
			return m('fieldset.submenu',
				m('legend.submenu-header', {onclick: toggle, class: open ? "open" : "closed"},
					m('span', family.name),
					m('span.submenu-toggle', "▿")
				),
				m('div.submenu-content',
					family.features.map(feature => {
						return m('div.checkbox', 
							m('input', {name: family.id, 
										type: 'checkbox', 
										id: `${feature.tag}-${feature.id}`, 
										value: feature.id, 
										checked: vnode.attrs.selectedFeatures[family.id][feature.id],
										onchange: (e) => {vnode.attrs.selectedFeatures[family.id][feature.id] = e.currentTarget.checked; vnode.attrs.onchange()},
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