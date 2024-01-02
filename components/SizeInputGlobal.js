import { Layout } from "../Layout.js";

export function SizeInputGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.size-input.size-input-global',
				m('button', { 
					onclick: () => { Layout.size.decrement() },
					disabled: !Layout.size.locked
				}, '－'),
				m('input', {
					type: 'text', 
					value: Layout.size.get(),
					onchange: (e) => {Layout.size.set(e.currentTarget.value)},
					disabled: !Layout.size.locked
				}),
				m('button', {
					onclick: () => { Layout.size.increment() },
					disabled: !Layout.size.locked
				}, '＋'),
				m('button.size-input-lock', {
					onclick: () => {Layout.size.locked = !Layout.size.locked}
				}, `${Layout.size.locked ? '🔒' : '🔓'}`)
				)
		}
	}
}