import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";

export function FontSelectGlobal(initialVnode) {
	return {
		onupdate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			// 15 is the size of the arrows
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth + 15;
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		view: function(vnode) {
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, Layout.font?.name),
				m('select', {
					oninput: (e) => {Layout.fontId = e.target.options[e.target.selectedIndex].value},
					disabled: !Layout.fontLocked
				},
				Fonts.list.map((font) => {
					return m('option', { value: font.id, selected: Layout.fontId == font.id}, font.name)
				})
				),
				m('button.font-select-lock', {
					onclick: () => {Layout.fontLocked = !Layout.fontLocked}
				}, Layout.fontLocked ? '🔒' : '🔓'),
				)
		}
	}
}