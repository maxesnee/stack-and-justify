import { Layout } from "../Layout.js";
import { Tooltip } from './Tooltip.js';

export function CaseSelectGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.case-select',
				m('div.case-select-lock',
					m('button', {
							onclick: () => {Layout.filterLocked = !Layout.filterLocked}
						}, Layout.filterLocked ? '🔒' : '🔓'),
					m(Tooltip, {label: 'Apply to all lines'})
				),
				m('div.select-wrapper', {disabled: !Layout.filterLocked},
					m('select.case-select', {
						onchange: (e) => {Layout.filter = e.currentTarget.selectedIndex},
					},
						m('option', {value: 'lowercase', selected: Layout.filter == 0}, 'Lowercase'),
						m('option', {value: 'uppercase', selected: Layout.filter == 1}, 'Uppercase'),
						m('option', {value: 'capitalised', selected: Layout.filter == 2}, 'Capitalised')
					)
				)
			)
		}
	}
}