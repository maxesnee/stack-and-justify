import { Layout } from "../Layout.js";

export function CaseSelectGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.case-select', 
				m('button.case-select-lock', {
					onclick: () => {Layout.filterLocked = !Layout.filterLocked}
				}, Layout.filterLocked ? '🔒' : '🔓'),
				m('select.case-select', {
					onchange: (e) => {Layout.filter = e.currentTarget.selectedIndex},
					disabled: !Layout.filterLocked
				},
				m('option', {value: 'lowercase', selected: Layout.filter == 0}, 'Lowercase'),
				m('option', {value: 'uppercase', selected: Layout.filter == 1}, 'Uppercase'),
				m('option', {value: 'capitalised', selected: Layout.filter == 2}, 'Capitalised')
				)
				)
		}
	}
}