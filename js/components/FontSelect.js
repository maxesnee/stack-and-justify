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
			const fontName = vnode.attrs.params.font ? vnode.attrs.params.font.name : '';
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, fontName),
				m('div.select-wrapper', {class: Layout.fontLocked ? "disabled" : ""},
					m('select', {
						disabled: Layout.fontLocked,
						oninput: (e) => {vnode.attrs.params.fontId = e.target.options[e.target.selectedIndex].value },
					},
						Fonts.list.map((font) => {
							return m('option', { value: font.id, selected: vnode.attrs.params.fontId == font.id}, font.name)
						})
					)
				)
			)
		}
	}
}