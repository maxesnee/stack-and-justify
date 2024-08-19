import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";
import { Tooltip } from "./Tooltip.js";

export function FontSelectGlobal(initialVnode) {
	return {
		onupdate: function(vnode) {
			// Get the width of the hidden label and update the width of the select
			const width = vnode.dom.querySelector('.font-select-hidden-label').offsetWidth;
			vnode.dom.querySelector('select').style.width = width + 'px';
		},
		view: function(vnode) {
			const fontName = Layout.font ? Layout.font.name : '';
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, fontName),
				m('div.select-wrapper', {class: !Layout.fontLocked ? "disabled" : ""},
					m('select', {
						disabled: !Layout.fontLocked,
						oninput: (e) => {Layout.fontId = e.target.options[e.target.selectedIndex].value},
					},
						Fonts.map((font) => {
							return m('option', { value: font.id, selected: Layout.fontId == font.id}, font.name)
						})
					),
				),
				m('div.font-select-lock',
					m('button', {
						onclick: () => {Layout.fontLocked = !Layout.fontLocked}
					}, Layout.fontLocked ? '🔒' : '🔓'),
					m(Tooltip, {label: 'Apply to all lines'})
				)
			)
		}
	}
}