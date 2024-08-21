import { Layout } from "../Layout.js";

export function CaseSelect(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.select-wrapper', {class: Layout.filterLocked.val ? "disabled": ""},
				m('select.case-select', {
					disabled: Layout.filterLocked.val,
					onchange: (e) => {vnode.attrs.params.filter.val = e.currentTarget.selectedIndex},
				},
					m('option', {value: 'lowercase', selected: vnode.attrs.params.filter.val == 0}, 'Lowercase'),
					m('option', {value: 'uppercase', selected: vnode.attrs.params.filter.val == 1}, 'Uppercase'),
					m('option', {value: 'capitalised', selected: vnode.attrs.params.filter.val == 2}, 'Capitalised')
				)
			)
		}
	}
}