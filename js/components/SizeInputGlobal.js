import { Layout } from "../Layout.js";
import { Tooltip } from "./Tooltip.js";

export function SizeInputGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.size-input.size-input-global',
				m('button', { 
					onclick: () => { Layout.size.decrement() },
					disabled: !Layout.sizeLocked
				}, '－'),
				m('input', {
					type: 'text', 
					value: Layout.size.get(),
					onchange: (e) => {Layout.size.set(e.currentTarget.value)},
					disabled: !Layout.sizeLocked
				}),
				m('button', {
					onclick: () => { Layout.size.increment() },
					disabled: !Layout.sizeLocked
				}, '＋'),
				m('div.size-input-lock',
					m('button', {
						onclick: () => {Layout.sizeLocked = !Layout.sizeLocked}
					}, `${Layout.sizeLocked ? '🔒' : '🔓'}`),
					m(Tooltip, {label: 'Apply to all lines'})
				)
			)
		}
	}
}