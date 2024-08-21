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
			const fontName = Layout.font.val ? Layout.font.val.name : '';
			return m('div.font-select', 
				m('span.font-select-hidden-label', {style: {position: 'absolute', visibility: 'hidden'}}, fontName),
				m('div.select-wrapper', {class: !Layout.fontLocked.val ? "disabled" : ""},
					m('select', {
						disabled: !Layout.fontLocked.val,
						oninput: (e) => {Layout.font.val = Fonts.find(font => font.id === e.target.options[e.target.selectedIndex].value)},
					},
						Fonts.map((font) => {
							return m('option', { value: font.id, selected: Layout.font.val.id == font.id}, font.name)
						})
					),
				),
				m('div.font-select-lock',
					m('button', {
						onclick: () => {Layout.fontLocked.val = !Layout.fontLocked.val}
					}, Layout.fontLocked.val ? '🔒' : '🔓'),
					m(Tooltip, {label: 'Apply to all lines'})
				)
			)
		}
	}
}