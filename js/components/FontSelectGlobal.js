import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";

export function FontSelectGlobal(initialVnode) {
	return {
		onupdate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth;
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		view: function(vnode) {
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, Layout.font?.name),
				m('div.select-wrapper', {disabled: !Layout.fontLocked},
					m('select', {
						oninput: (e) => {Layout.fontId = e.target.options[e.target.selectedIndex].value},
					},
						Fonts.list.map((font) => {
							return m('option', { value: font.id, selected: Layout.fontId == font.id}, font.name)
						})
					),
				),
				m('button.font-select-lock', {
					onclick: () => {Layout.fontLocked = !Layout.fontLocked}
				}, Layout.fontLocked ? '🔒' : '🔓'),
				)
		}
	}
}