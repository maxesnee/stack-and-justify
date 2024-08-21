import { Layout } from "../Layout.js";
import { Filters } from "../Filters.js";
import { Tooltip } from './Tooltip.js';

export function FilterSelectGlobal(initialVnode) {
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
						onchange: (e) => {Layout.filter.val = Filters.find(filter => filter.id === e.currentTarget.value)},
					},
						Filters.map(filter => {
							return m('option', {value: filter.id, selected: Layout.filter.val.id === filter.id}, filter.label)
						})
					)
				)
			)
		}
	}
}