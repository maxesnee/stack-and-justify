import { Layout } from "../Layout.js";
import { Tooltip } from './Tooltip.js';

export function CaseSelectGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.case-select',
				m('div.case-select-lock',
					m('button', {
							onclick: () => {Layout.filterLocked.val = !Layout.filterLocked.val}
						}, Layout.filterLocked.val ? '🔒' : '🔓'),
					m(Tooltip, {label: 'Apply to all lines'})
				),
				m('div.select-wrapper', {class: !Layout.filterLocked.val ? "disabled" : ""},
					m('select.case-select', {
						disabled: !Layout.filterLocked.val,
						onchange: (e) => {Layout.filter.val = e.currentTarget.selectedIndex},
					},
						m('option', {value: 'lowercase', selected: Layout.filter.val == 0}, 'Lowercase'),
						m('option', {value: 'uppercase', selected: Layout.filter.val == 1}, 'Uppercase'),
						m('option', {value: 'capitalised', selected: Layout.filter.val == 2}, 'Capitalised')
					)
				)
			)
		}
	}
}