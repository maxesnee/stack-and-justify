import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";

export function FontSelect(initialVnode) {
	return {
		onupdate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			// 15 is the size of the arrow
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth + 15;
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		view: function(vnode) {
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, vnode.attrs.params.font?.name),
				m('select', {
					oninput: (e) => {vnode.attrs.params.fontId = e.target.options[e.target.selectedIndex].value },
					disabled: Layout.fontLocked
				},
				Fonts.list.map((font) => {
					return m('option', { value: font.id, selected: vnode.attrs.params.fontId == font.id}, font.name)
				}))
				)
		}
	}
}