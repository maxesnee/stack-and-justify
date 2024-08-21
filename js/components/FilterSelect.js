import { Layout } from "../Layout.js";
import { Filters } from "../Filters.js";

export function FilterSelect(initialVnode) {
	return {
		view: function(vnode) {
			const line = vnode.attrs.params;
			return m('div.select-wrapper', {class: Layout.filterLocked.val ? "disabled": ""},
				m('select.case-select', {
					disabled: Layout.filterLocked.val,
					onchange: (e) => {line.filter.val = Filters.find(filter => filter.id === e.currentTarget.value)},
				},
					Filters.map(filter => {
						return m('option', {value: filter.id, selected: line.filter.val.id === filter.id}, filter.label)
					})
				)
			)
		}
	}
}