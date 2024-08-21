import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";

export function FontSelect(initialVnode) {
	return {
		oncreate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth;
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		onupdate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth;
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		view: function(vnode) {
			const line = vnode.attrs.params;
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, line.font.val.name),
				m('div.select-wrapper', {class: Layout.fontLocked.val ? "disabled" : ""},
					m('select', {
						disabled: Layout.fontLocked.val,
						oninput: (e) => {line.font.val = Fonts.find(e.target.selectedOptions[0].value)},
					},
						Fonts.list.map(family => {
							return m('optgroup', {label: family.name},
								family.list.map(font => {
									return m('option', { value: font.id, selected: line.font.val.id == font.id}, font.name);
								})
							)
						})
					)
				)
			)
		}
	}
}