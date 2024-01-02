import { Layout } from "../Layout.js";

export function CaseSelect(initialVnode) {
	return {
		view: function(vnode) {
			return m('select.case-select', {
				onchange: (e) => {vnode.attrs.params.filter = e.currentTarget.selectedIndex},
				disabled: Layout.filterLocked
			},
			m('option', {value: 'lowercase', selected: vnode.attrs.params.filter == 0}, 'Lowercase'),
			m('option', {value: 'uppercase', selected: vnode.attrs.params.filter == 1}, 'Uppercase'),
			m('option', {value: 'capitalised', selected: vnode.attrs.params.filter == 2}, 'Capitalised')
			)
		}
	}
}