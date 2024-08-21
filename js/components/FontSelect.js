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
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, line.fontSelection.val.name),
				m('div.select-wrapper', {class: Layout.fontSelectionLocked.val ? "disabled" : ""},
					m('select', {
						disabled: Layout.fontSelectionLocked.val,
						oninput: (e) => {line.fontSelection.val = Fonts.find(font => font.id === e.target.options[e.target.selectedIndex].value)},
					},
						Fonts.map((font) => {
							return m('option', { value: font.id, selected: line.fontSelection.val.id == font.id}, font.name)
						})
					)
				)
			)
		}
	}
}